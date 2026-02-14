"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/RatingStars";

type Row = {
  id: string
  product_id: string
  product_title?: string
  user: { id: string; email?: string | null; name?: string | null }
  rating: number
  review: string | null
  created_at: string
}

export default function AdminRatingsPage() {
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/admin/ratings', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setRows(data || [])
    })()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ratings & Reviews</h1>
        <p className="text-sm text-gray-500">Overview of all customer ratings</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-semibold">{r.product_title || r.product_id}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{r.user?.name || r.user?.email || r.user?.id}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <RatingStars value={r.rating} readonly />
                    <Badge variant="outline">{r.rating}</Badge>
                  </div>
                </TableCell>
                <TableCell className="max-w-xl">
                  <div className="truncate">{r.review || ""}</div>
                </TableCell>
                <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">No ratings found</TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
