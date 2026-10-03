import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toE164 } from "@/lib/phone";

type Item = {
  number: string;
  name: string;
  count: number;
  registered: boolean;
};

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const number = params.get("number")?.trim();
  const name = params.get("name")?.trim();
  const country = params.get("country")?.trim() || "BD";

  if (number) {
    const e164 = toE164(number, country);
    if (!e164) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { phone: e164 },
      select: { name: true },
    });
    if (user) {
      return NextResponse.json({
        number: e164,
        name: user.name,
        count: 0,
        registered: true,
      });
    }

    const top = await prisma.savedName.groupBy({
      by: ["name"],
      where: { number: { e164 } },
      _count: { userId: true },
      orderBy: { _count: { userId: "desc" } },
      take: 1,
    });
    if (top.length === 0) {
      return NextResponse.json({
        number: e164,
        name: null,
        count: 0,
        registered: false,
      });
    }
    return NextResponse.json({
      number: e164,
      name: top[0].name,
      count: top[0]._count.userId,
      registered: false,
    });
  }

  if (name) {
    const items = new Map<string, Item>();

    const users = await prisma.user.findMany({
      where: {
        name: { contains: name, mode: "insensitive" },
        phone: { not: null },
      },
      select: { name: true, phone: true },
      take: 10,
    });
    for (const u of users) {
      if (!u.phone) continue;
      items.set(`${u.phone}|${u.name}`, {
        number: u.phone,
        name: u.name,
        count: 0,
        registered: true,
      });
    }

    const rows = await prisma.savedName.findMany({
      where: { name: { contains: name, mode: "insensitive" } },
      select: { name: true, number: { select: { e164: true } } },
      take: 500,
    });
    for (const r of rows) {
      const key = `${r.number.e164}|${r.name}`;
      const existing = items.get(key);
      if (existing) {
        if (!existing.registered) existing.count++;
        continue;
      }
      items.set(key, {
        number: r.number.e164,
        name: r.name,
        count: 1,
        registered: false,
      });
    }

    const results = [...items.values()]
      .sort((a, b) => {
        if (a.registered !== b.registered) return a.registered ? -1 : 1;
        return b.count - a.count;
      })
      .slice(0, 10);
    return NextResponse.json({ results });
  }

  return NextResponse.json(
    { error: "number or name is required" },
    { status: 400 }
  );
}
