"use client";

import React from "react";
import { useOrderStore } from "@/store/useOrderStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { Search, Filter, Calendar as CalendarIcon } from "lucide-react";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();

  // Enhanced status styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100";
      case "Confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100";
      case "Shipped":
        return "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100";
      case "Delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
      case "Cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Orders Management</h1>
          <p className="text-slate-500 mt-1">Monitor and fulfill customer requests.</p>
        </div>
        
        {/* Mock Search/Filter Bar for Layout */}
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
             <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-9 h-10 w-64 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
             />
           </div>
           <button className="flex items-center gap-2 px-4 h-10 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
             <Filter className="h-4 w-4" /> Filter
           </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px] font-bold text-slate-600">Order ID</TableHead>
              <TableHead className="font-bold text-slate-600">Customer</TableHead>
              <TableHead className="font-bold text-slate-600">Date</TableHead>
              <TableHead className="font-bold text-slate-600">Total</TableHead>
              <TableHead className="font-bold text-slate-600">Status</TableHead>
              <TableHead className="text-right font-bold text-slate-600 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-48 text-slate-400">
                   <div className="flex flex-col items-center justify-center space-y-2">
                      <CalendarIcon className="h-8 w-8 opacity-20" />
                      <p>No orders found in the database.</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                  <TableCell className="font-bold text-blue-600">
                    <span className="bg-blue-50 px-2 py-1 rounded">#{order.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{order.customer.name}</span>
                      <span className="text-xs text-slate-500">{order.customer.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {new Date(order.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                        variant="outline" 
                        className={`font-semibold px-2.5 py-0.5 rounded-full border ${getStatusStyles(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end">
                        <Select
                        defaultValue={order.status}
                        onValueChange={(val: any) => updateOrderStatus(order.id, val)}
                        >
                        <SelectTrigger className="w-[140px] h-9 bg-white border-slate-200 hover:border-blue-400 transition-all focus:ring-blue-500/20 shadow-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end" className="rounded-xl border-slate-200 bg-blue-300">
                            <SelectItem value="Pending" className="focus:bg-amber-50 focus:text-amber-700">Pending</SelectItem>
                            <SelectItem value="Confirmed" className="focus:bg-blue-50 focus:text-blue-700">Confirmed</SelectItem>
                            <SelectItem value="Shipped" className="focus:bg-indigo-50 focus:text-indigo-700">Shipped</SelectItem>
                            <SelectItem value="Delivered" className="focus:bg-emerald-50 focus:text-emerald-700">Delivered</SelectItem>
                            <SelectItem value="Cancelled" className="focus:bg-rose-50 focus:text-rose-700">Cancelled</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
