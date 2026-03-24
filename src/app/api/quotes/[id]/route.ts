import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const quote = await prisma.quote.findFirst({
    where: { id: params.id, userId: user.id },
    include: { customer: true },
  });

  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  return NextResponse.json(quote);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();

  const result = await prisma.quote.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      project: body.project,
      value: body.value,
      status: body.status,
      content: body.content,
      validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  const updated = await prisma.quote.findFirst({
    where: { id: params.id },
    include: { customer: { select: { id: true, name: true } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const result = await prisma.quote.deleteMany({
    where: { id: params.id, userId: user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
