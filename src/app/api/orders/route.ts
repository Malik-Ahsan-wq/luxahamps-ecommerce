import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const body = await req.json();
    const { items, totalPrice } = body || {};
    if (!Array.isArray(items) || typeof totalPrice !== "number") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const res = await db.collection("orders").insertOne({
      userId,
      items,
      totalPrice,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: res.insertedId.toString() }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Server error" }, { status: 500 });
  }
}
