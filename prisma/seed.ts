import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const num = await prisma.phoneNumber.upsert({
    where: { e164: "+8801700000000" },
    update: {},
    create: { e164: "+8801700000000" },
  });
  const names = ["রহিম ভাই", "রহিম ভাই", "রহিম ভাই", "রহিম মিস্ত্রি"];
  for (let i = 0; i < names.length; i++) {
    const email = `test${i}@example.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    await prisma.savedName.upsert({
      where: { userId_numberId: { userId: user.id, numberId: num.id } },
      update: { name: names[i] },
      create: { userId: user.id, numberId: num.id, name: names[i] },
    });
  }
}

main().finally(() => prisma.$disconnect());
