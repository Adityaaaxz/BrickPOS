import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload dir exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `product_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
      size: file.size,
    }, { status: 201 });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
