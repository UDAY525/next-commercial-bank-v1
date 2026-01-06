export interface RequestGrantSuccessResponse {
  success: true;
  data: {
    id: string;
    status: "pending" | "granted" | "rejected";
    // updatedAt: string;
  };
}

export interface RequestGrantErrorResponse {
  success: false;
  error: string;
}

export type RequestGrantResponse =
  | RequestGrantSuccessResponse
  | RequestGrantErrorResponse;
