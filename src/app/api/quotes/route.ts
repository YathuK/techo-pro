import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const quotes = await prisma.quote.findMany({
    where: { userId: user.id },
    include: {
      customer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quotes);
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  if (!body.project || !body.customerId) return badRequest("Project and customer are required");

  const count = await prisma.quote.count({ where: { userId: user.id } });
  const quoteNumber = `QT-${(2000 + count + 1).toString()}`;

  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      project: body.project,
      value: body.value || 0,
      status: body.status || "Draft",
      content: body.content || null,
      aiGenerated: body.aiGenerated || false,
      validUntil: body.validUntil ? new Date(body.validUntil) : null,
      userId: user.id,
      customerId: body.customerId,
    },
    include: {
      customer: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(quote, { status: 201 });
}
