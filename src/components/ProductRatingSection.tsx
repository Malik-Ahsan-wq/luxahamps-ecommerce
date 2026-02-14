"use client"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import RatingStars from "./RatingStars"
import { Button } from "@/components/ui/button"
import RatingModal from "./RatingModal"
import { useAuthStore, getCurrentSession } from "@/store/useAuthStore"

type Props = {
  productId: string
}

export default function ProductRatingSection({ productId }: Props) {
  const { isAuthenticated } = useAuthStore()
  const [avg, setAvg] = useState(0)
  const [count, setCount] = useState(0)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const load = async () => {
    const { data: p } = await supabase.from('products').select('average_rating').eq('id', productId).maybeSingle()
    setAvg(Number(p?.average_rating || 0))
    const res = await fetch(`/api/ratings?productId=${encodeURIComponent(productId)}&page=1&pageSize=1`, { cache: 'no-store' })
    if (res.ok) {
      const d = await res.json()
      setCount(Number(d.total || 0))
    }
    const s = await getCurrentSession()
    if (s?.user) {
      const ur = await fetch(`/api/ratings/user?productId=${encodeURIComponent(productId)}`, { cache: 'no-store' })
      if (ur.ok) {
        const v = await ur.json()
        setUserRating(v ? Number(v.rating || 0) : null)
      }
    }
  }

  useEffect(() => {
    load()
  }, [productId])

  const display = useMemo(() => Number(avg.toFixed(1)), [avg])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <RatingStars value={avg} readonly />
        <div className="text-sm text-gray-600">{display} · {count} {count === 1 ? 'review' : 'reviews'}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm">{userRating ? `Your rating: ${userRating}` : (isAuthenticated ? "You haven't rated this product yet" : "Login required to submit rating")}</div>
        <Button variant="outline" onClick={() => setOpen(true)} size="sm">{userRating ? 'Update Rating' : 'Rate Product'}</Button>
      </div>
      <RatingModal productId={productId} open={open} onOpenChange={(o) => { setOpen(o); if (!o) load() }} />
    </div>
  )
}
