import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const employees = await prisma.employee.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  if (!body.name || !body.role) return badRequest("Name and role are required");

  const employee = await prisma.employee.create({
    data: {
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      role: body.role,
      team: body.team || null,
      status: body.status || "Available",
      rating: body.rating || 0,
      hoursPerWeek: body.hoursPerWeek || 0,
      certifications: body.certifications ? JSON.stringify(body.certifications) : null,
      userId: user.id,
    },
  });

  return NextResponse.json(employee, { status: 201 });
}
