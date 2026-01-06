import { getUserId, isUserAdmin } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import RequestGrantsModel from "@/models/RequestGrants";
import connectDB from "@/connectDB";
import { RequestGrantResponse } from "@/lib/contracts/admin/request-grant";

// In Next 16, params is a Promise that must be awaited
type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest) {
  // 1. Await the params object first
  // const { id } = await params;

  console.log(`Matched Dynamic Route for ID:`);

  return NextResponse.json({
    success: true,
    message: `Next 16 Dynamic Route works! ID:`,
  });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  await connectDB();
  const { id } = await params;
  const { status } = await req.json();

  const userId = await getUserId();
  const isAdmin = await isUserAdmin();

  if (!userId || !isAdmin) {
    return NextResponse.json<RequestGrantResponse>(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!status) {
    return NextResponse.json<RequestGrantResponse>(
      { success: false, error: "Status is required" },
      { status: 400 }
    );
  }

  const updatedRequest = await RequestGrantsModel.findByIdAndUpdate(
    id,
    { status },
    {
      new: true, // return updated doc
      runValidators: true, // ensure schema validation
    }
  );

  if (!updatedRequest) {
    return NextResponse.json<RequestGrantResponse>(
      { success: false, error: "Request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json<RequestGrantResponse>({
    success: true,
    data: {
      id: updatedRequest._id.toString(),
      status: updatedRequest.status,
    },
  });

  // Your logic for updating status here
  return NextResponse.json({
    success: true,
    updatedRequest,
  });
}
