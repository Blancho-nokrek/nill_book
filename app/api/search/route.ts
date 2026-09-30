import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const number = params.get("number")?.trim();
  const name = params.get("name")?.trim();

  if (number) {
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

  if (name) {
    const rows = await prisma.savedName.findMany({
      where: { name: { contains: name, mode: "insensitive" } },
      select: { name: true, number: { select: { e164: true } } },
      take: 500,
    });
    const counts = new Map<
      string,
      { number: string; name: string; count: number }
    >();
    for (const r of rows) {
      const key = `${r.number.e164}|${r.name}`;
      const item = counts.get(key) ?? {
        number: r.number.e164,
        name: r.name,
        count: 0,
      };
      item.count++;
      counts.set(key, item);
    }
    const results = [...counts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    return NextResponse.json({ results });
  }

  return NextResponse.json(
    { error: "number or name is required" },
    { status: 400 }
  );
}
