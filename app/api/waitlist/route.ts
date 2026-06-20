import { NextResponse } from "next/server";
import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";

const schema = z.object({
  email: z.string().email(),
});

const WAITLIST_PATH = path.join(process.cwd(), ".waitlist.json");

async function readWaitlist(): Promise<string[]> {
  try {
    const data = await fs.readFile(WAITLIST_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const { email } = parsed.data;
  const list = await readWaitlist();

  if (list.includes(email)) {
    return NextResponse.json({ message: "Already on the list." });
  }

  list.push(email);
  await fs.writeFile(WAITLIST_PATH, JSON.stringify(list, null, 2));

  return NextResponse.json({ message: "Added to waitlist." });
}
