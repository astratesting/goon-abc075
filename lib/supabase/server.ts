// Supabase server client - used for server-side operations
// In the Prisma-based setup, we use prisma client directly
import { prisma } from "@/lib/prisma";

export function getServerClient() {
  return prisma;
}
