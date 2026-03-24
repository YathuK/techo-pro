import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const jobs = await prisma.job.findMany({
    where: { userId: user.id },
    include: {
      customer: { select: { id: true, name: true } },
      crew: { select: { id: true, name: true, team: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  if (!body.type || !body.customerId) return badRequest("Job type and customer are required");

  // Generate job number
  const count = await prisma.job.count({ where: { userId: user.id } });
  const jobNumber = `JOB-${(1000 + count + 1).toString()}`;

  const job = await prisma.job.create({
    data: {
      jobNumber,
      type: body.type,
      address: body.address || null,
      status: body.status || "Quote Sent",
      value: body.value || 0,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      progress: body.progress || 0,
      materials: body.materials || null,
      notes: body.notes || null,
      userId: user.id,
      customerId: body.customerId,
      crew: body.crewIds
        ? { connect: body.crewIds.map((id: string) => ({ id })) }
        : undefined,
    },
    include: {
      customer: { select: { id: true, name: true } },
      crew: { select: { id: true, name: true, team: true } },
    },
  });

  return NextResponse.json(job, { status: 201 });
}
