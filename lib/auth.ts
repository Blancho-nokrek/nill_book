import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      phone: { type: "string", required: false },
      gender: { type: "string", required: false },
      birthday: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const birthday = (user as { birthday?: string | null }).birthday;
          return {
            data: {
              ...user,
              birthday: birthday ? new Date(birthday) : null,
            },
          };
        },
      },
    },
  },
});
