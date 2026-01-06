import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest // Change this to a Promise
) {
  console.log("📝📝📝📝📝📝📝");

  try {
    // Await the params before accessing them

    // To read the body if you are sending status updates:
    // const body = await req.json();
    // const { status } = body;

    return NextResponse.json({
      success: true,
      message: `Request updated successfully`,
    });
  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
