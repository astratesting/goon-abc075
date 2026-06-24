import { z } from "zod";

export const createOrderSchema = z.object({
  fileName: z.string().min(1),
  fileSizeBytes: z.number().int().positive().max(100 * 1024 * 1024, "Max 100MB for MVP"),
  tech: z.enum(["fdm", "sla", "sls"]),
  material: z.string().min(1),
  color: z.string().min(1),
  quantity: z.number().int().min(1).max(99).default(1),
  shippingZip: z.string().min(1, "ZIP code is required"),
  aiRepair: z.boolean().default(true),
  fileBase64: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export function validateOrderInput(data: unknown) {
  return createOrderSchema.safeParse(data);
}
