import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: body.name,
          price: Number(body.price) || 0,
          category: body.category || "",
          image: body.image || "",
          colors: Array.isArray(body.colors) ? body.colors : [],
          sizes: Array.isArray(body.sizes) ? body.sizes : [],
          inStock: !!body.inStock,
          description: body.description || "",
          updatedAt: new Date(),
        },
      }
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const client = await clientPromise;
    const db = client.db();
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Server error" }, { status: 500 });
  }
}
