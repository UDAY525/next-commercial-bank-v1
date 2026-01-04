import RequestGrantsModel from "@/models/RequestGrants";
import connectDB from "@/connectDB";
import { getUserId } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().min(1, { message: "Must provide a user name" }),

  phone: z
    .string()
    .regex(/^\d{10,}$/, { message: "Phone must be at least 10 digits" }),

  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),

  quantity: z
    .number()
    .int({ message: "Quantity must be a whole number" })
    .min(1, { message: "Quantity must be at least 1" })
    .max(100, { message: "Quantity cannot exceed 100" }),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.format() },
        { status: 400 }
      );
    }

    const request = await RequestGrantsModel.create({
      userId,
      ...validation.data, // ✅ trusted, typed data
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, request }, { status: 201 });
  } catch (error: unknown) {
    console.error("Request grant error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
