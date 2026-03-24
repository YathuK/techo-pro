import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const customer = await prisma.customer.findFirst({
    where: { id: params.id, userId: user.id },
    include: { jobs: true, quotes: true, invoices: true },
  });

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json(customer);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();

  const customer = await prisma.customer.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      status: body.status,
      notes: body.notes,
    },
  });

  if (customer.count === 0) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const updated = await prisma.customer.findFirst({ where: { id: params.id } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const result = await prisma.customer.deleteMany({
    where: { id: params.id, userId: user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
