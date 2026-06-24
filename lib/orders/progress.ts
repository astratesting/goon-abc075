import { TECH_LEAD_DAYS } from "../pricing";

const STAGE_ORDER = ["queued", "printing", "quality_check", "shipped"] as const;
export type OrderStage = (typeof STAGE_ORDER)[number];

export interface OrderLike {
  status: string;
  tech: string;
  createdAt: Date | string;
  statusUpdatedAt: Date | string;
}

function stageIndex(status: string): number {
  const idx = STAGE_ORDER.indexOf(status as OrderStage);
  return idx >= 0 ? idx : 0;
}

function timeForStage(tech: string, stageIdx: number): number {
  const lead = TECH_LEAD_DAYS[tech] || TECH_LEAD_DAYS.fdm;
  const totalDays = lead.max;
  const stageDays = totalDays / STAGE_ORDER.length;
  return stageDays * 24 * 60 * 60 * 1000;
}

export function advanceOrderStatus(order: OrderLike): { newStatus: string; changed: boolean } {
  const currentIdx = stageIndex(order.status);
  if (currentIdx >= STAGE_ORDER.length - 1) {
    return { newStatus: order.status, changed: false };
  }

  const createdAt = new Date(order.createdAt).getTime();
  const now = Date.now();

  for (let i = currentIdx + 1; i < STAGE_ORDER.length; i++) {
    const elapsed = now - createdAt;
    const required = timeForStage(order.tech, i);
    if (elapsed >= required) {
      continue;
    }
    // This stage hasn't been reached yet
    if (i > currentIdx) {
      const prevStageRequired = timeForStage(order.tech, i - 1);
      if (elapsed >= prevStageRequired) {
        return { newStatus: STAGE_ORDER[i - 1], changed: true };
      }
    }
  }

  // If we got through all stages, the order is shipped
  if (currentIdx < STAGE_ORDER.length - 1) {
    return { newStatus: STAGE_ORDER[STAGE_ORDER.length - 1], changed: true };
  }

  return { newStatus: order.status, changed: false };
}

export function getCurrentStage(status: string): OrderStage {
  const idx = stageIndex(status);
  return STAGE_ORDER[idx];
}

export function getStageList(): readonly OrderStage[] {
  return STAGE_ORDER;
}

export function isOrderActive(status: string): boolean {
  return status === "queued" || status === "printing" || status === "quality_check";
}
