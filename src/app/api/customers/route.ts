import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const customers = await prisma.customer.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { jobs: true, invoices: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Calculate totalSpent per customer
  const customersWithSpent = await Promise.all(
    customers.map(async (c) => {
      const result = await prisma.invoice.aggregate({
        where: { customerId: c.id, userId: user.id },
        _sum: { amount: true },
      });
      return {
        ...c,
        jobCount: c._count.jobs,
        totalSpent: result._sum.amount || 0,
      };
    })
  );

  return NextResponse.json(customersWithSpent);
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  if (!body.name) return badRequest("Customer name is required");

  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      status: body.status || "Lead",
      notes: body.notes || null,
      userId: user.id,
    },
  });

  return NextResponse.json(customer, { status: 201 });
}
