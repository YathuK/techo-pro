import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const employee = await prisma.employee.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(employee);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();

  const result = await prisma.employee.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role,
      team: body.team,
      status: body.status,
      rating: body.rating,
      hoursPerWeek: body.hoursPerWeek,
      certifications: body.certifications ? JSON.stringify(body.certifications) : undefined,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const updated = await prisma.employee.findFirst({ where: { id: params.id } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const result = await prisma.employee.deleteMany({
    where: { id: params.id, userId: user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
