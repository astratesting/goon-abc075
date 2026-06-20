import { hash, compare } from "bcryptjs";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}

const DEMO_EMAIL = "demo@demo.app";
const DEMO_PASSWORD = "demo123";

let users: DemoUser[] = [];
let initialized = false;

async function initDemoUser() {
  if (initialized) return;
  const hash_val = await hash(DEMO_PASSWORD, 10);
  users = [
    {
      id: "demo-user-001",
      email: DEMO_EMAIL,
      name: "Demo Inventor",
      passwordHash: hash_val,
    },
  ];
  initialized = true;
}

export async function findUserByEmail(email: string): Promise<DemoUser | null> {
  await initDemoUser();
  return users.find((u) => u.email === email) ?? null;
}

export async function verifyPassword(
  email: string,
  password: string
): Promise<DemoUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const valid = await compare(password, user.passwordHash);
  return valid ? user : null;
}

export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<DemoUser> {
  await initDemoUser();
  const existing = users.find((u) => u.email === email);
  if (existing) throw new Error("User already exists");
  const passwordHash = await hash(password, 10);
  const user: DemoUser = {
    id: `user-${Date.now()}`,
    email,
    name,
    passwordHash,
  };
  users.push(user);
  return user;
}
