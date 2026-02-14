"use client"
import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import RatingStars from "@/components/RatingStars"
import { signInWithEmail, useAuthStore, getCurrentSession } from "@/store/useAuthStore"

export default function MessageButton() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    ;(async () => {
      const s = await getCurrentSession()
      if (s?.user) {
        useAuthStore.getState().setSession(
          { id: s.user.id, email: s.user.email ?? null, name: s.user.user_metadata?.name ?? null, avatar_url: s.user.user_metadata?.avatar_url ?? null },
          s.access_token || ''
        )
      }
    })()
  }, [])

  const productId = useMemo(() => {
    if (!pathname) return null
    const m = pathname.match(/^\/product\/([^\/\?\#]+)/)
    return m ? m[1] : null
  }, [pathname])

  const handleLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInWithEmail(email, password)
    } catch (e: any) {
      setError(e.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    setError(null)
    if (!productId) {
      setError("Open a product page to submit a review")
      return
    }
    if (!isAuthenticated) {
      setError("Please login first")
      return
    }
    if (rating < 1) {
      setError("Please select a rating")
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, review })
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || "Failed to submit")
      }
      setOpen(false)
      setRating(0)
      setReview("")
    } catch (e: any) {
      setError(e.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        aria-label="Message"
        onClick={() => setOpen(true)}
        className="fixed left-4 bottom-24 z-50 rounded-full bg-black px-4 py-2 text-white text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-gray-800"
      >
        Message
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Access</DialogTitle>
            <DialogDescription>
              Login with email and password, then leave a product review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="text-sm font-semibold">Login</div>
              <div className="space-y-2">
                <Label htmlFor="msg-email">Email</Label>
                <Input id="msg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="msg-pass">Password</Label>
                <Input id="msg-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button variant="outline" onClick={handleLogin} disabled={loading}>Login</Button>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold">Leave a Review</div>
              <div className="flex items-center gap-3">
                <RatingStars value={rating} onChange={setRating} />
                <span className="text-xs text-gray-500">{rating || ''}</span>
              </div>
              <Textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder={productId ? "Share your thoughts..." : "Open a product detail page to review"} />
              <Button onClick={handleSubmitReview} disabled={loading || !productId}>Submit Review</Button>
            </div>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
