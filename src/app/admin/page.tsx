 "use client";
 
 import React from "react";
 import { useOrderStore } from "@/store/useOrderStore";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { formatPrice } from "@/lib/utils";

 export default function AdminPage() {
   const { orders } = useOrderStore();

  return (
     <div className="container mx-auto px-4 py-12">
       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
       <div className="grid gap-6 md:grid-cols-3">
         <Card>
           <CardHeader>
             <CardTitle>Total Orders</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-bold">{orders.length}</div>
           </CardContent>
         </Card>
         <Card>
           <CardHeader>
             <CardTitle>Pending Orders</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-bold">
               {orders.filter((o) => o.status === "Pending").length}
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardHeader>
             <CardTitle>Revenue</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-bold">
               {formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
  );
 }
