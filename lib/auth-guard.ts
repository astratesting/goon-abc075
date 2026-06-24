import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

export async function requireProfile() {
  const session = await requireSession();
  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      onboarded: true,
      createdAt: true,
    },
  });
  if (!profile) {
    redirect("/login");
  }
  return profile;
}

export async function requireOnboarded() {
  const profile = await requireProfile();
  if (!profile.onboarded) {
    redirect("/onboarding");
  }
  return profile;
}
