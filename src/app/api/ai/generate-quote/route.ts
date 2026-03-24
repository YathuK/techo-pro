import { NextResponse } from "next/server";
import { getAuthUser, unauthorized, badRequest } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

// AI quote generation — uses rules-based estimation
// Can be swapped for OpenAI/Claude API call later
function generateQuoteContent(params: {
  description: string;
  customerName: string;
  companyName: string;
  markup: number;
}) {
  const { description, customerName, companyName, markup } = params;
  const desc = description.toLowerCase();

  // Parse area from description
  let area = 400;
  const areaMatch = desc.match(/(\d+)\s*x\s*(\d+)/);
  if (areaMatch) area = parseInt(areaMatch[1]) * parseInt(areaMatch[2]);
  const sqftMatch = desc.match(/(\d+)\s*sq\s*f/);
  if (sqftMatch) area = parseInt(sqftMatch[1]);

  // Determine products and pricing
  const materials: { name: string; qty: string; cost: number }[] = [];
  let laborDays = 0;

  if (desc.includes("patio") || desc.includes("paver")) {
    materials.push({ name: "Techo-Bloc Blu 60 Smooth (Charcoal)", qty: `${area} sq ft`, cost: area * 9 });
    materials.push({ name: "Polymeric Sand (HP Nextgel)", qty: `${Math.ceil(area / 60)} bags`, cost: Math.ceil(area / 60) * 40 });
    materials.push({ name: "Crushed Gravel Base 3/4\"", qty: `${Math.ceil(area / 40)} tons`, cost: Math.ceil(area / 40) * 70 });
    materials.push({ name: "Geotextile Fabric", qty: `${area + 100} sq ft`, cost: (area + 100) * 0.35 });
    laborDays = Math.ceil(area / 80);
  }

  if (desc.includes("wall") || desc.includes("retaining")) {
    const linFt = desc.match(/(\d+)\s*(lin|linear|feet|ft)/i) ? parseInt(desc.match(/(\d+)\s*(lin|linear|feet|ft)/i)![1]) : 40;
    materials.push({ name: "Techo-Bloc Mini-Creta Wall (Shale Grey)", qty: `${linFt} lin ft`, cost: linFt * 35 });
    materials.push({ name: "Wall Adhesive", qty: `${Math.ceil(linFt / 20)} tubes`, cost: Math.ceil(linFt / 20) * 12 });
    laborDays += Math.ceil(linFt / 20);
  }

  if (desc.includes("fire pit") || desc.includes("firepit")) {
    materials.push({ name: "Techo-Bloc Valencia Fire Pit Kit", qty: "1 kit", cost: 1800 });
    materials.push({ name: "Fire Ring Insert (36\")", qty: "1 pc", cost: 250 });
    laborDays += 1.5;
  }

  if (desc.includes("step") || desc.includes("stair")) {
    materials.push({ name: "Techo-Bloc Borealis Steps", qty: "6 pcs", cost: 6 * 180 });
    laborDays += 1;
  }

  if (desc.includes("walk") || desc.includes("path")) {
    const pathArea = area > 300 ? 200 : area;
    materials.push({ name: "Techo-Bloc Blu 60 Smooth (Charcoal)", qty: `${pathArea} sq ft`, cost: pathArea * 9 });
    materials.push({ name: "Edge Restraint (Snap Edge)", qty: `${Math.ceil(pathArea / 10)} pcs`, cost: Math.ceil(pathArea / 10) * 12 });
    laborDays += Math.ceil(pathArea / 120);
  }

  if (desc.includes("driveway")) {
    const driveArea = area < 400 ? 500 : area;
    materials.push({ name: "Techo-Bloc Blu 60 Smooth (Charcoal)", qty: `${driveArea} sq ft`, cost: driveArea * 9 });
    materials.push({ name: "Heavy-Duty Base (Crushed Limestone)", qty: `${Math.ceil(driveArea / 25)} tons`, cost: Math.ceil(driveArea / 25) * 75 });
    materials.push({ name: "Polymeric Sand (HP Nextgel)", qty: `${Math.ceil(driveArea / 60)} bags`, cost: Math.ceil(driveArea / 60) * 40 });
    laborDays += Math.ceil(driveArea / 60);
  }

  // Default if nothing matched
  if (materials.length === 0) {
    materials.push({ name: "Techo-Bloc Pavers", qty: `${area} sq ft`, cost: area * 10 });
    materials.push({ name: "Base Materials", qty: "1 lot", cost: area * 2 });
    laborDays = Math.ceil(area / 80);
  }

  const markupMultiplier = 1 + markup / 100;
  const materialTotal = materials.reduce((sum, m) => sum + m.cost, 0);

  const laborItems = [
    { name: "Site Preparation & Excavation", days: Math.ceil(laborDays * 0.25), rate: 1200 },
    { name: "Base Installation & Compaction", days: Math.ceil(laborDays * 0.2), rate: 1200 },
    { name: "Installation", days: Math.ceil(laborDays * 0.35), rate: 1200 },
    { name: "Finishing & Cleanup", days: Math.max(0.5, laborDays * 0.1), rate: 1200 },
  ];
  const laborTotal = laborItems.reduce((sum, l) => sum + l.days * l.rate, 0);

  const subtotal = Math.round((materialTotal + laborTotal) * markupMultiplier);
  const hst = Math.round(subtotal * 0.13);
  const total = subtotal + hst;

  const today = new Date();
  const validDate = new Date(today);
  validDate.setDate(validDate.getDate() + 30);

  let quote = `QUOTE\n${companyName}\n${"━".repeat(40)}\n\n`;
  quote += `Client: ${customerName}\n`;
  quote += `Project: ${description || "Custom Hardscaping Project"}\n`;
  quote += `Date: ${today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n\n`;

  quote += `MATERIALS\n${"─".repeat(20)}\n`;
  materials.forEach((m) => {
    quote += `• ${m.name} — ${m.qty}    $${Math.round(m.cost * markupMultiplier).toLocaleString()}\n`;
  });

  quote += `\nLABOR\n${"─".repeat(20)}\n`;
  laborItems.forEach((l) => {
    quote += `• ${l.name} — ${l.days} day${l.days !== 1 ? "s" : ""}    $${Math.round(l.days * l.rate * markupMultiplier).toLocaleString()}\n`;
  });

  quote += `\nSUBTOTAL    $${subtotal.toLocaleString()}\n`;
  quote += `HST (13%)    $${hst.toLocaleString()}\n`;
  quote += `${"━".repeat(40)}\n`;
  quote += `TOTAL    $${total.toLocaleString()}\n\n`;
  quote += `Terms: 30% deposit, 40% at midpoint, 30% on completion\n`;
  quote += `Warranty: 5-year workmanship guarantee\n`;
  quote += `Valid until: ${validDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`;

  return { content: quote, value: total };
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  if (!body.description || !body.customerId)
    return badRequest("Description and customer are required");

  const customer = await prisma.customer.findFirst({
    where: { id: body.customerId, userId: user.id },
  });
  if (!customer) return badRequest("Customer not found");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  const { content, value } = generateQuoteContent({
    description: body.description,
    customerName: customer.name,
    companyName: dbUser?.companyName || "Your Company",
    markup: body.markup || 35,
  });

  // Save the quote to the database
  const count = await prisma.quote.count({ where: { userId: user.id } });
  const quoteNumber = `QT-${(2000 + count + 1).toString()}`;

  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      project: body.description,
      value,
      status: "Draft",
      content,
      aiGenerated: true,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: user.id,
      customerId: body.customerId,
    },
    include: {
      customer: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(quote, { status: 201 });
}
