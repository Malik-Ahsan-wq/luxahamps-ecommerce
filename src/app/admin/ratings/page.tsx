"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/RatingStars";
import { Star, MessageSquare } from "lucide-react";

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
        <h1 className="text-3xl font-bold tracking-tight">Ratings & Reviews</h1>
        <p className="text-muted-foreground mt-1">Customer feedback and product ratings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            All Reviews ({rows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">Customer reviews will appear here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="max-w-md">Review</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.product_title || r.product_id}</TableCell>
                    <TableCell className="text-sm">{r.user?.name || r.user?.email || r.user?.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <RatingStars value={r.rating} readonly />
                        <Badge variant="outline">{r.rating}/5</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate text-sm text-muted-foreground">{r.review || "No review text"}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
