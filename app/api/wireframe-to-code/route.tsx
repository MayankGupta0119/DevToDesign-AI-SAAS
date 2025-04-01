import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, imageUrl, uid, model, email } = await req.json();
  try {
    const creditResult = await prisma.user.findMany({
      where: {
        email: email,
      },
    });

    console.log("CreditResults ==>", creditResult);

    if (creditResult[0]?.credits > 0) {
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

      //update user credits
      const data = await prisma.user.update({
        data: { credits: creditResult[0]?.credits - 1 },
        where: { email: email },
      });

      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: "Not enough credits" });
    }
  } catch (error) {
    console.error("Error creating the record", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const uid = searchParams?.get("uid");
  const email = searchParams?.get("email");
  if (uid) {
    const result = await prisma.wireframeToCode.findUnique({
      where: { uid: uid },
    });
    return NextResponse.json(result);
  } else if (email) {
    const result = await prisma.wireframeToCode.findMany({
      where: { createdBy: email },
    });
    return NextResponse.json(result);
  } else {
    return NextResponse.json({ error: "No Record was found" });
  }
}

//saving code to database
export async function PUT(req: NextRequest) {
  const { uid, codeResp } = await req.json();
  try {
    const result = await prisma.wireframeToCode.update({
      where: { uid },
      data: { code: codeResp },
      select: { uid: true },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error Updating the record", error);
    return NextResponse.json(
      { error: "Failed to update code" },
      { status: 500 }
    );
  }
}
