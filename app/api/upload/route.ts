import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { estimateVolume } from "@/lib/quote-calculator";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedFormats = [
      "model/stl",
      "application/octet-stream",
      "application/sla",
      "model/obj",
      "model/3mf",
      "",
    ];
    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExts = ["stl", "obj", "3mf"];
    if (!ext || !validExts.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file format. Accepted: STL, OBJ, 3MF" },
        { status: 400 }
      );
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uniqueName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, uniqueName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const volume = estimateVolume(file.size, ext);

    const uploaded = await prisma.uploadedFile.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        filePath: `uploads/${uniqueName}`,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        format: ext,
        volume,
      },
    });

    return NextResponse.json({
      id: uploaded.id,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
      format: uploaded.format,
      volume: uploaded.volume,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await prisma.uploadedFile.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(files);
}
