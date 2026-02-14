"use client"
import { useEffect, useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import RatingStars from "./RatingStars"
import { supabase } from "@/lib/supabaseClient"

type Review = {
  id: string
  user_id: string
  product_id: string
  rating: number
  review: string | null
  created_at: string
  user?: { id: string; name?: string | null; email?: string | null; avatar_url?: string | null }
}

type Props = {
  productId: string
  enableRealtime?: boolean
}

export default function ProductReviews({ productId, enableRealtime = true }: Props) {
  const [items, setItems] = useState<Review[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState<"newest" | "highest" | "lowest">("newest")
  const pageSize = 5

  const canLoadMore = useMemo(() => items.length < total, [items.length, total])

  const load = async (reset = false) => {
    const p = reset ? 1 : page
    const res = await fetch(`/api/ratings?productId=${encodeURIComponent(productId)}&page=${p}&pageSize=${pageSize}&sort=${sort}`, { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()
    setTotal(Number(data.total || 0))
    if (reset) {
      setItems(data.items || [])
      setPage(1)
    } else {
      setItems((prev) => [...prev, ...(data.items || [])])
    }
  }

  useEffect(() => {
    load(true)
  }, [productId, sort])

  useEffect(() => {
    if (!enableRealtime) return
    const channel = supabase
      .channel(`ratings:${productId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ratings', filter: `product_id=eq.${productId}` }, () => {
        load(true)
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [productId, enableRealtime])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Customer Reviews</div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={(v: any) => setSort(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="highest">Highest rating</SelectItem>
              <SelectItem value="lowest">Lowest rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((r) => (
          <div key={r.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <RatingStars value={r.rating} readonly />
              <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
            <div className="mt-2 text-sm">{r.review || ""}</div>
            <div className="mt-2 text-xs text-gray-500">
              {r.user?.name || r.user?.email || r.user_id}
            </div>
          </div>
        ))}
        {items.length === 0 ? <div className="text-sm text-gray-500">No reviews yet</div> : null}
      </div>
      {canLoadMore ? (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => { setPage((p) => p + 1); load() }}>Load More</Button>
        </div>
      ) : null}
    </div>
  )
}
