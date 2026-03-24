import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const items = await prisma.inventoryItem.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  if (!body.name || !body.category || !body.unit)
    return badRequest("Name, category, and unit are required");

  const item = await prisma.inventoryItem.create({
    data: {
      name: body.name,
      category: body.category,
      unit: body.unit,
      inStock: body.inStock || 0,
      reorderPoint: body.reorderPoint || 0,
      price: body.price || 0,
      location: body.location || null,
      userId: user.id,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
