export enum EmailType {
  DONATION_SUCCESS = "DONATION_SUCCESS",
  GRANT_APPROVED = "GRANT_APPROVED",
  GRANT_REJECTED = "GRANT_REJECTED",
  GRANT_PENDING = "GRANT_PENDING",
}

/**
 * Map each email type to its required payload
 */
export interface EmailPayloadMap {
  [EmailType.DONATION_SUCCESS]: {
    to: string;
    name: string;
    bloodGroup: string;
    quantity: number;
  };

  [EmailType.GRANT_APPROVED]: {
    to: string;
    name: string;
    bloodGroup: string;
    quantity: number;
  };

  [EmailType.GRANT_REJECTED]: {
    to: string;
    name: string;
    reason?: string;
  };

  [EmailType.GRANT_PENDING]: {
    to: string;
    name: string;
    bloodGroup: string;
    quantity: number;
  };
}
