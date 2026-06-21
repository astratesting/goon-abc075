export interface Material {
  key: string;
  name: string;
  technology: string;
  description: string;
  basePrice: number;
  perMbRate: number;
  leadDaysMin: number;
  leadDaysMax: number;
}

export const MATERIALS: Material[] = [
  {
    key: "fdm_pla",
    name: "FDM PLA",
    technology: "FDM",
    description: "General-purpose plastic. Great for prototypes and concept models.",
    basePrice: 15,
    perMbRate: 0.5,
    leadDaysMin: 3,
    leadDaysMax: 5,
  },
  {
    key: "sla_resin",
    name: "SLA Resin",
    technology: "SLA",
    description: "Ultra-fine detail and smooth surface. Ideal for miniatures and dental.",
    basePrice: 40,
    perMbRate: 1.2,
    leadDaysMin: 4,
    leadDaysMax: 6,
  },
  {
    key: "sls_nylon",
    name: "SLS Nylon",
    technology: "SLS",
    description: "High-strength engineering plastic. Durable, flexible, wear-resistant.",
    basePrice: 50,
    perMbRate: 1.8,
    leadDaysMin: 5,
    leadDaysMax: 8,
  },
];

export function getMaterialByKey(key: string): Material | undefined {
  return MATERIALS.find((m) => m.key === key);
}

export function formatMaterialName(key: string): string {
  return getMaterialByKey(key)?.name ?? key;
}
