import connectDB from "@/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { auth } from "@/auth";
import { getUserId } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId();
    const isAdmin = await isUserAdmin();
    if (!userId || !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized in user" },
        { status: 401 }
      );
    }
    if (req.nextUrl.searchParams.get("user") === "all") {
      const allUsers = await User.find().lean();
      return NextResponse.json({ users: allUsers });
    }
    // if(req.nextUrl.searchParams.get('user')) {
    //      const user = await User.find({}).lean();
    //   return NextResponse.json({ users: allUsers });
    // }
  } catch (error) {
    console.log("All user access error");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const adminId = await getUserId();
    const isAdmin = await isUserAdmin();

    if (!adminId || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = await req.json();

    if (!userId || !["admin", "regular"].includes(role)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await User.findByIdAndUpdate(userId, { role });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const userId = await getUserId();
//     const isAdmin = await isUserAdmin();
//     if (!userId || !isAdmin) {
//       return NextResponse.json(
//         { error: "Unauthorized in user" },
//         { status: 401 }
//       );
//     }

//     if(req.nextUrl.searchParams.get('userId'))

//   } catch (error) {
//     return NextResponse.json(
//         { error: "Unauthorized in user" },
//         { status: 401 }
//       );
//   }
// }

export async function isUserAdmin() {
  const session = await auth();
  if (!session || !session?.user) return false;

  try {
    await connectDB();
    const isAdmin = await User.findOne({
      email: session.user?.email,
      role: "admin",
    }).lean();

    console.warn("Is Admin:", isAdmin);

    return isAdmin;
  } catch (error) {}
}
