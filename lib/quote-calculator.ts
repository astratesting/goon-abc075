export interface MaterialPricing {
  name: string;
  pricePerCm3: number;
  description: string;
}

export const MATERIALS: Record<string, MaterialPricing> = {
  "PLA+": {
    name: "PLA+",
    pricePerCm3: 0.15,
    description: "General purpose, smooth finish, great for prototypes",
  },
  PLA: {
    name: "PLA",
    pricePerCm3: 0.12,
    description: "Biodegradable, easy to print, ideal for concept models",
  },
  PETG: {
    name: "PETG",
    pricePerCm3: 0.22,
    description: "Chemical resistant, durable, food-safe compatible",
  },
  ABS: {
    name: "ABS",
    pricePerCm3: 0.28,
    description: "Heat resistant, strong, suitable for functional parts",
  },
  Nylon: {
    name: "Nylon",
    pricePerCm3: 0.35,
    description: "High strength, flexible, wear-resistant engineering plastic",
  },
  Resin: {
    name: "Resin",
    pricePerCm3: 0.45,
    description: "Ultra-fine detail, smooth surface, ideal for miniatures",
  },
};

const FILE_SIZE_VOLUME_RATIO: Record<string, number> = {
  stl: 0.0008,
  obj: 0.001,
  "3mf": 0.0009,
  step: 0.0012,
  stp: 0.0012,
  iges: 0.0011,
  igs: 0.0011,
};

export function estimateVolume(
  fileSizeBytes: number,
  format: string
): number {
  const ext = format.toLowerCase().replace(".", "");
  const ratio = FILE_SIZE_VOLUME_RATIO[ext] ?? 0.001;
  const volumeCm3 = Math.max(1, Math.round(fileSizeBytes * ratio * 100) / 100);
  return volumeCm3;
}

export function calculateQuote(
  volumeCm3: number,
  material: string,
  quantity: number
) {
  const mat = MATERIALS[material] ?? MATERIALS["PLA+"];
  const basePrice = volumeCm3 * mat.pricePerCm3;

  let quantityDiscount = 0;
  if (quantity >= 50) quantityDiscount = 0.25;
  else if (quantity >= 20) quantityDiscount = 0.15;
  else if (quantity >= 10) quantityDiscount = 0.08;
  else if (quantity >= 5) quantityDiscount = 0.03;

  const pricePerUnit = Math.max(5, basePrice * (1 - quantityDiscount));
  const setupFee = quantity === 1 ? 5 : 0;
  const totalPrice = pricePerUnit * quantity + setupFee;

  return {
    volumeCm3,
    material: mat.name,
    materialDescription: mat.description,
    pricePerCm3: mat.pricePerCm3,
    basePrice: Math.round(basePrice * 100) / 100,
    quantityDiscount: Math.round(quantityDiscount * 100),
    pricePerUnit: Math.round(pricePerUnit * 100) / 100,
    setupFee,
    totalPrice: Math.round(totalPrice * 100) / 100,
    quantity,
  };
}
