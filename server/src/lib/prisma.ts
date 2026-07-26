import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Optional: Export PrismaClient type for convenience
export type { PrismaClient };