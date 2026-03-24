import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, userId: user.id },
    include: { customer: true, job: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(invoice);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();

  const result = await prisma.invoice.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      project: body.project,
      amount: body.amount,
      paid: body.paid,
      status: body.status,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      sentDate: body.sentDate ? new Date(body.sentDate) : undefined,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const updated = await prisma.invoice.findFirst({
    where: { id: params.id },
    include: { customer: { select: { id: true, name: true } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const result = await prisma.invoice.deleteMany({
    where: { id: params.id, userId: user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
