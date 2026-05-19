import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, image, imageUrl, stock, pieces, ageRange, rating } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category: category.toLowerCase(),
        image: image || category.toLowerCase(),
        imageUrl: imageUrl || null,
        stock: parseInt(stock) || 0,
        pieces: parseInt(pieces) || 0,
        ageRange: ageRange || "6+",
        rating: parseFloat(rating) || 4.5,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
