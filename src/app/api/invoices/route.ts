import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: {
      customer: { select: { id: true, name: true } },
      job: { select: { id: true, jobNumber: true, type: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  if (!body.customerId || !body.amount) return badRequest("Customer and amount are required");

  const count = await prisma.invoice.count({ where: { userId: user.id } });
  const invoiceNumber = `INV-${(800 + count + 1).toString()}`;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      project: body.project || null,
      amount: body.amount,
      paid: body.paid || 0,
      status: body.status || "Draft",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      sentDate: body.sentDate ? new Date(body.sentDate) : null,
      userId: user.id,
      customerId: body.customerId,
      jobId: body.jobId || null,
    },
    include: {
      customer: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(invoice, { status: 201 });
}
