import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();

  const result = await prisma.inventoryItem.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      name: body.name,
      category: body.category,
      unit: body.unit,
      inStock: body.inStock,
      reorderPoint: body.reorderPoint,
      price: body.price,
      location: body.location,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const updated = await prisma.inventoryItem.findFirst({ where: { id: params.id } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const result = await prisma.inventoryItem.deleteMany({
    where: { id: params.id, userId: user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
