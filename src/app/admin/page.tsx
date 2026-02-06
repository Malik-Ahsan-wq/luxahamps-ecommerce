"use client";

import React from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { useProductStore } from "@/store/useProductStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Users, DollarSign, Activity, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const { orders } = useOrderStore();
  const { products } = useProductStore();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="p-8 space-y-8 min-h-screen bg-[#f8fafc]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="hidden md:block">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                <Activity className="mr-1.5 h-4 w-4" /> Live Updates
            </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue Card */}
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-500/10 to-transparent">
            <CardTitle className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Total Revenue</CardTitle>
            <div className="p-2 bg-emerald-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-slate-900">{formatPrice(totalRevenue)}</div>
            <div className="flex items-center mt-1 text-emerald-600 text-xs font-medium">
                <TrendingUp className="mr-1 h-3 w-3" /> +20.1% from last month
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-500/10 to-transparent">
            <CardTitle className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Orders</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-slate-900">{totalOrders}</div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              <span className="text-orange-600 font-bold">{pendingOrders}</span> pending orders
            </p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-violet-500/10 to-transparent">
            <CardTitle className="text-sm font-semibold text-violet-700 uppercase tracking-wider">Inventory</CardTitle>
            <div className="p-2 bg-violet-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-slate-900">{totalProducts}</div>
            <p className="text-xs font-medium text-slate-500 mt-1 italic">
              In stock and active
            </p>
          </CardContent>
        </Card>
        
        {/* New Users Card */}
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-500/10 to-transparent">
            <CardTitle className="text-sm font-semibold text-orange-700 uppercase tracking-wider">New Users</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-slate-900">+12</div>
            <p className="text-xs font-medium text-orange-600 mt-1">
                +180% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          </div>
          <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Activity className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No recent activity to show.</p>
              <p className="text-sm text-slate-400">Transactions and logs will appear here as they happen.</p>
          </div>
      </div>
    </div>
  );
}