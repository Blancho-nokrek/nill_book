import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const number = new URL(req.url).searchParams.get("number")?.trim();
  if (!number) {
    return NextResponse.json({ error: "number দিন" }, { status: 400 });
  }

  const top = await prisma.savedName.groupBy({
    by: ["name"],
    where: { number: { e164: number } },
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
    take: 1,
  });

  if (top.length === 0) {
    return NextResponse.json({ number, name: null, count: 0 });
  }
  return NextResponse.json({
    number,
    name: top[0].name,
    count: top[0]._count.userId,
  });
}
