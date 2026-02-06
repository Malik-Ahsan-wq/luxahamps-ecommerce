import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/auth/signin");
  }
  const client = await clientPromise;
  const db = client.db();
  const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id.toString()} className="border rounded p-3">
            <div>User: {o.userId}</div>
            <div>Total: {o.totalPrice}</div>
            <div>Date: {new Date(o.createdAt).toLocaleString()}</div>
            <div>Items: {Array.isArray(o.items) ? o.items.length : 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
