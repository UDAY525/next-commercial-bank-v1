export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export type TransactionType = "IN" | "OUT";

export interface InventoryFlowStats {
  /** Total quantity moved */
  quantity: number;

  /** Number of transactions */
  transactions: number;

  /** Number of unique users involved */
  uniqueUsers: number;

  /** User IDs involved (admin-only) */
  userIds: string[];
}

export interface BloodGroupInventoryStats {
  in: InventoryFlowStats;
  out: InventoryFlowStats;
  requestStats: RequestStatusStats;
  /** in.quantity - out.quantity */
  netQuantity: number;
}

export interface RequestStatusStats {
  totalRequests: number;
  totalAcceptedRequests: number;
  totalRequestedQuantity: number;
  totalGrantedQuantity: number;
  fulfillmentPercentage: number;
}

export interface InventoryStatsResponse {
  summary: {
    totalInQuantity: number;
    totalOutQuantity: number;
    netQuantity: number;
  };

  byBloodGroup: Record<BloodGroup, BloodGroupInventoryStats>;
}
