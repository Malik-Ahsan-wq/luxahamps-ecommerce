import clientPromise from "@/lib/mongodb";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }
    const hashed = await hash(password, 10);
    const res = await users.insertOne({
      name,
      email,
      password: hashed,
      role: "user",
      createdAt: new Date(),
    });
    return NextResponse.json({ id: res.insertedId.toString(), email }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Server error" }, { status: 500 });
  }
}
