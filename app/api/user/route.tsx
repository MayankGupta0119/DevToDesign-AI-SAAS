import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userEmail, userName } = await req.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          name: userName,
          email: userEmail,
          credits: 0,
        },
      });
      return NextResponse.json(newUser);
    }
    return NextResponse.json(existingUser);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const email = searchParams?.get("email");

  if (email) {
    const result = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return NextResponse.json(result);
  }
}
