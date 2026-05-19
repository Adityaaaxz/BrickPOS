import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// GET single product
export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

// PUT update product
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, category, image, imageUrl, stock, pieces, ageRange, rating } = body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category && { category: category.toLowerCase(), image: category.toLowerCase() }),
        ...(image && { image }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(pieces !== undefined && { pieces: parseInt(pieces) }),
        ...(ageRange && { ageRange }),
        ...(rating !== undefined && { rating: parseFloat(rating) }),
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
