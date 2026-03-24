import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const job = await prisma.job.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      customer: true,
      crew: true,
      invoices: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();

  // Verify ownership
  const existing = await prisma.job.findFirst({ where: { id: params.id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const job = await prisma.job.update({
    where: { id: params.id },
    data: {
      type: body.type ?? existing.type,
      address: body.address,
      status: body.status,
      value: body.value,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      progress: body.progress,
      materials: body.materials,
      notes: body.notes,
      crewIds: body.crewIds ?? undefined,
    },
    include: {
      customer: { select: { id: true, name: true } },
      crew: { select: { id: true, name: true, team: true } },
    },
  });

  return NextResponse.json(job);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const result = await prisma.job.deleteMany({
    where: { id: params.id, userId: user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
