"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/useOrderStore";
import { formatPrice } from "@/lib/utils";
import { Package, Calendar, MapPin, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
  const router = useRouter();
  const { orders } = useOrderStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const userOrders = orders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Confirmed": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Shipped": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Delivered": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Cancelled": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            View and track your order history
          </p>
        </div>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>

      {userOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-gray-50">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link href="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-gray-200">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <Badge className={getStatusColor(order.status)} variant="secondary">
                        {order.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatPrice(order.total)}</p>
                    <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4" /> Items
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Shipping Details
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
                      <p className="font-medium">{order.customer.name}</p>
                      <p>{order.customer.address}</p>
                      <p>{order.customer.city}, {order.customer.postalCode}</p>
                      <p>{order.customer.phone}</p>
                      <p className="text-muted-foreground mt-2 pt-2 border-t border-gray-200">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
