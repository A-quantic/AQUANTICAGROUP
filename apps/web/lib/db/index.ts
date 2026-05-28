import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Only create Prisma client if DATABASE_URL is set
let prisma: PrismaClient;

if (process.env.DATABASE_URL) {
  prisma = globalForPrisma.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} else {
  // Mock prisma for build/development without database
  console.warn("DATABASE_URL not set - using mock prisma");
  prisma = new Proxy({} as PrismaClient, {
    get: () => () => Promise.resolve(null),
  });
}

export { prisma };

// Export all types from Prisma Client
export * from "@prisma/client";

// Export prisma instance as default
export default prisma;
