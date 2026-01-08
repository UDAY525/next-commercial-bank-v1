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

export interface GetAllRequestGrantsSuccessResponse {
  success: true;
  requests: RequestGrantDTO[];
}

export interface GetAllRequestGrantsErrorResponse {
  success: false;
  error: string;
}

export type GetAllRequestGrants =
  | GetAllRequestGrantsSuccessResponse
  | GetAllRequestGrantsErrorResponse;

export interface RequestGrantDTO {
  id: string; // map _id → id
  status: "pending" | "granted" | "rejected";
  userId: string;
  bloodGroup: string;
  quantity: number;
  name: string;
  phone: string;
  createdAt: string;
}
