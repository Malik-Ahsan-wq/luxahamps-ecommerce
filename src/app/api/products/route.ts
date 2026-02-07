import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const items = await db.collection("products").find({}).sort({ _id: -1 }).toArray();
    const data = items.map((p) => ({
      id: (p._id as ObjectId).toString(),
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      colors: Array.isArray(p.colors) ? p.colors : [],
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      inStock: !!p.inStock,
      description: p.description ?? "",
    }));
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const doc = {
      name: body.name,
      price: Number(body.price) || 0,
      category: body.category || "",
      image: body.image || "",
      colors: Array.isArray(body.colors) ? body.colors : [],
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      inStock: !!body.inStock,
      description: body.description || "",
      createdAt: new Date(),
    };
    const client = await clientPromise;
    const db = client.db();
    const res = await db.collection("products").insertOne(doc);
    return NextResponse.json({ id: res.insertedId.toString() }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Server error" }, { status: 500 });
  }
}
