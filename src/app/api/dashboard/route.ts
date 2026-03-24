import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const [
    customerCount,
    activeJobCount,
    pendingQuoteCount,
    recentJobs,
    invoiceStats,
  ] = await Promise.all([
    prisma.customer.count({ where: { userId: user.id, status: "Active" } }),
    prisma.job.count({ where: { userId: user.id, status: { in: ["In Progress", "Scheduled"] } } }),
    prisma.quote.count({ where: { userId: user.id, status: { in: ["Draft", "Sent"] } } }),
    prisma.job.findMany({
      where: { userId: user.id },
      include: { customer: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.invoice.aggregate({
      where: { userId: user.id, status: "Paid" },
      _sum: { paid: true },
    }),
  ]);

  const monthlyRevenue = invoiceStats._sum.paid || 0;

  // Low stock items
  const lowStockItems = await prisma.inventoryItem.findMany({
    where: {
      userId: user.id,
    },
  });
  const lowStock = lowStockItems.filter((i) => i.inStock <= i.reorderPoint);

  // Overdue invoices
  const overdueInvoices = await prisma.invoice.findMany({
    where: {
      userId: user.id,
      status: "Overdue",
    },
    include: { customer: { select: { name: true } } },
  });

  return NextResponse.json({
    stats: {
      monthlyRevenue,
      customerCount,
      activeJobCount,
      pendingQuoteCount,
    },
    recentJobs: recentJobs.map((j) => ({
      id: j.id,
      jobNumber: j.jobNumber,
      client: j.customer.name,
      type: j.type,
      status: j.status,
      value: j.value,
    })),
    insights: {
      lowStockCount: lowStock.length,
      lowStockItems: lowStock.map((i) => i.name),
      overdueInvoices: overdueInvoices.map((i) => ({
        invoiceNumber: i.invoiceNumber,
        client: i.customer.name,
        balance: i.amount - i.paid,
      })),
    },
  });
}
