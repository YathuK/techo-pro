import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test DB connection by running a simple command
    await prisma.user.count();
    return NextResponse.json({
      status: "ok",
      db: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Health check DB error:", err);
    return NextResponse.json({
      status: "error",
      db: "disconnected",
      error: err instanceof Error ? err.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
