import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "You're already subscribed! 🧱" }, { status: 409 });
    }

    // Create subscriber
    await prisma.subscriber.create({ data: { email } });

    return NextResponse.json({ message: "Welcome to the Builders Club! 🎉" }, { status: 201 });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
