import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin");
  }
  const client = await clientPromise;
  const db = client.db();
  const orders = await db.collection("orders").find({ userId: (session.user as any).id }).sort({ createdAt: -1 }).toArray();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Welcome, {(session.user as any).name || (session.user as any).email}</h1>
      <form action="/api/orders" method="POST" className="mb-8">
        <input type="hidden" name="items" value='[]' />
        <input type="hidden" name="totalPrice" value='0' />
        <Button type="submit">Place Sample Order</Button>
      </form>
      <h2 className="text-2xl font-semibold mb-2">Your Orders</h2>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o._id.toString()} className="border rounded p-3">
            <div>Total: {o.totalPrice}</div>
            <div>Date: {new Date(o.createdAt).toLocaleString()}</div>
            <div>Items: {Array.isArray(o.items) ? o.items.length : 0}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
