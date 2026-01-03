import { z } from "zod";

/* --------------------------------------------------
   Common / Reusable Enums
-------------------------------------------------- */

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "AB+",
  "AB-",
  "B+",
  "B-",
  "O+",
  "O-",
] as const;

export const BloodGroupEnum = z.enum(BLOOD_GROUPS);

// export const BloodGroupEnum = z.enum([
//   "A+",
//   "A-",
//   "B+",
//   "B-",
//   "AB+",
//   "AB-",
//   "O+",
//   "O-",
// ]);

export const DonationTypeEnum = z.enum(["IN", "OUT"]);

/* --------------------------------------------------
   History Item
-------------------------------------------------- */

export const DonationHistoryItemSchema = z.object({
  id: z.string(),
  type: DonationTypeEnum,
  phone: z.string(),
  bloodGroup: BloodGroupEnum,
  quantity: z.number(),
  createdAt: z.string(), // ISO date
});

/* --------------------------------------------------
   Summary
-------------------------------------------------- */

export const DonationSummarySchema = z.object({
  totalQuantity: z.number(),
  totalDonationsCount: z.number(),
  lastDonationAt: z.string().nullable(),
});

/* --------------------------------------------------
   Group-wise Breakdown
-------------------------------------------------- */

export const GroupWiseBreakdownSchema = z.object({
  group: BloodGroupEnum,
  quantity: z.number(),
  count: z.number(),
});

/* --------------------------------------------------
   Data Payload
-------------------------------------------------- */

export const DonationDashboardDataSchema = z.object({
  summary: DonationSummarySchema,
  history: z.array(DonationHistoryItemSchema),
  groupWiseBreakdown: z.array(GroupWiseBreakdownSchema),
});

/* --------------------------------------------------
   API Response
-------------------------------------------------- */

export const DonationDashboardResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: DonationDashboardDataSchema,
  timestamp: z.string(), // ISO date
});

/* --------------------------------------------------
   Type Exports (Frontend + Backend)
-------------------------------------------------- */

export type DonationHistoryItem = z.infer<typeof DonationHistoryItemSchema>;

export type DonationSummary = z.infer<typeof DonationSummarySchema>;

export type GroupWiseBreakdown = z.infer<typeof GroupWiseBreakdownSchema>;

export type DonationDashboardData = z.infer<typeof DonationDashboardDataSchema>;

export type DonationDashboardResponse = z.infer<
  typeof DonationDashboardResponseSchema
>;

export type DonationBloodGroup = z.infer<typeof BloodGroupEnum>;
