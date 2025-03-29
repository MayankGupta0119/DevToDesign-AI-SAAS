import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, imageUrl, uid, model, email } = await req.json();
  try {
    const result = await prisma.wireframeToCode.create({
      data: {
        uid: uid,
        imageUrl: imageUrl,
        model: model,
        description: description,
        createdBy: email,
        code: {},
      },
      select: { id: true },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating the record", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}
