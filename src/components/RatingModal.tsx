"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import RatingStars from "./RatingStars"
import { useAuthStore, getCurrentSession } from "@/store/useAuthStore"
import AuthModal from "@/components/AuthModal"

type Props = {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RatingModal({ productId, open, onOpenChange }: Props) {
  const { isAuthenticated } = useAuthStore()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      const s = await getCurrentSession()
      if (!s?.user) return
      const res = await fetch(`/api/ratings/user?productId=${encodeURIComponent(productId)}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setRating(Number(data.rating || 0))
          setReview(data.review || "")
        }
      }
    })()
  }, [productId])

  const submit = async () => {
    setError(null)
    setLoading(true)
    try {
      if (!isAuthenticated) {
        setAuthOpen(true)
        setLoading(false)
        return
      }
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, review }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Failed to save')
      }
      onOpenChange(false)
    } catch (e: any) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this product</DialogTitle>
          <DialogDescription>
            Select a star rating and write an optional review.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <RatingStars value={rating} onChange={setRating} />
            <span className="text-sm text-gray-500">{rating || ''}</span>
          </div>
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write an optional review"
          />
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button onClick={submit} disabled={loading || !isAuthenticated || rating < 1}>Submit</Button>
          </div>
        </div>
      </DialogContent>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </Dialog>
  )
}
