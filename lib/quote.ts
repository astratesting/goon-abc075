import { MATERIALS } from "./materials";

export interface QuoteResult {
  total: number;
  leadDaysMin: number;
  leadDaysMax: number;
}

export function computeQuote({
  material,
  fileSizeBytes,
}: {
  material: string;
  fileSizeBytes: number;
}): QuoteResult {
  const mat = MATERIALS.find((m) => m.key === material) ?? MATERIALS[0];
  const fileSizeMB = fileSizeBytes / (1024 * 1024);
  const total = Math.round((mat.basePrice + fileSizeMB * mat.perMbRate) * 100) / 100;
  return {
    total: Math.max(total, mat.basePrice),
    leadDaysMin: mat.leadDaysMin,
    leadDaysMax: mat.leadDaysMax,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
