import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const messages = await prisma.message.findMany({
    where: { userId: user.id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  if (!body.content || !body.customerId || !body.type)
    return badRequest("Content, customer, and type are required");

  const message = await prisma.message.create({
    data: {
      type: body.type,
      template: body.template || null,
      subject: body.subject || null,
      content: body.content,
      status: body.status || "draft",
      userId: user.id,
      customerId: body.customerId,
    },
    include: {
      customer: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(message, { status: 201 });
}
