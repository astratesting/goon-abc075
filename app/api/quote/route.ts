import { NextResponse } from "next/server";
import { calculateQuote, MATERIALS } from "@/lib/quote-calculator";
import { z } from "zod";

const quoteSchema = z.object({
  volumeCm3: z.number().positive(),
  material: z.string(),
  quantity: z.number().int().min(1).max(10000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { volumeCm3, material, quantity } = quoteSchema.parse(body);

    if (!MATERIALS[material]) {
      return NextResponse.json(
        { error: `Unknown material: ${material}. Available: ${Object.keys(MATERIALS).join(", ")}` },
        { status: 400 }
      );
    }

    const quote = calculateQuote(volumeCm3, material, quantity);
    return NextResponse.json(quote);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : "Quote calculation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
