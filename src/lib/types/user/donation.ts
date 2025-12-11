// lib/types/donations.ts
import { z } from "zod";

/** single donation returned from DB */
export const DonationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10,}$/, "Phone must be at least 10 digits"),
  donatedBloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
});
export type Donation = z.infer<typeof DonationSchema>;

/** summary group */
export const DonationSummaryItemSchema = z.object({
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  quantity: z.number().int().nonnegative(),
  frequency: z.number().int().nonnegative(),
});
export type DonationSummaryItem = z.infer<typeof DonationSummaryItemSchema>;

/** full API response for ?desc=summary */
export const DonationsSummaryResponseSchema = z.object({
  allDonationsByUser: z.array(DonationSchema),
  donatedBloodSummaryGroupWise: z.array(DonationSummaryItemSchema),
  totalQuantityOfDonations: z.number().nonnegative(),
});
export type DonationsSummaryResponse = z.infer<
  typeof DonationsSummaryResponseSchema
>;
