export interface TechPricing {
  tech: string;
  basePriceDollars: number;
  pricePerGramDollars: number;
  estimatedWeightGrams: (fileSizeBytes: number) => number;
}

export const TECH_PRICING: Record<string, TechPricing> = {
  fdm: {
    tech: "fdm",
    basePriceDollars: 15,
    pricePerGramDollars: 0.08,
    estimatedWeightGrams: (size) => Math.max(10, Math.round(size / 1024 / 1024 * 12)),
  },
  sla: {
    tech: "sla",
    basePriceDollars: 40,
    pricePerGramDollars: 0.15,
    estimatedWeightGrams: (size) => Math.max(5, Math.round(size / 1024 / 1024 * 8)),
  },
  sls: {
    tech: "sls",
    basePriceDollars: 50,
    pricePerGramDollars: 0.20,
    estimatedWeightGrams: (size) => Math.max(8, Math.round(size / 1024 / 1024 * 10)),
  },
};

export const TECH_LEAD_DAYS: Record<string, { min: number; max: number }> = {
  fdm: { min: 1, max: 2 },
  sla: { min: 1, max: 3 },
  sls: { min: 2, max: 4 },
};

export function computePrice({
  tech,
  fileSizeBytes,
  quantity,
}: {
  tech: string;
  fileSizeBytes: number;
  quantity: number;
}): number {
  const pricing = TECH_PRICING[tech];
  if (!pricing) return 0;
  const weight = pricing.estimatedWeightGrams(fileSizeBytes);
  const unitPrice = pricing.basePriceDollars + weight * pricing.pricePerGramDollars;
  return Math.round(unitPrice * quantity * 100) / 100;
}

export function computePriceCents({
  tech,
  fileSizeBytes,
  quantity,
}: {
  tech: string;
  fileSizeBytes: number;
  quantity: number;
}): number {
  const dollars = computePrice({ tech, fileSizeBytes, quantity });
  return Math.round(dollars * 100);
}

export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}
