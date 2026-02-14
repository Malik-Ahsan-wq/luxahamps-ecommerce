"use client"
import { useEffect, useState } from "react"
import RatingModal from "./RatingModal"
import AuthModal from "@/components/AuthModal"
import { useAuthStore } from "@/store/useAuthStore"
import { supabase } from "@/lib/supabaseClient"

type PromptConfig = {
  enableRealtime: boolean
  table: string
  statusesToTrigger: string[]
  itemsTables: string[]
  productIdsField: string
  debounceMs: number
  maxPerOrder: number
}

const DEFAULT_PROMPT_CONFIG: PromptConfig = {
  enableRealtime: true,
  table: "orders",
  statusesToTrigger: ["confirmed"],
  itemsTables: ["order_items", "orders_items"],
  productIdsField: "product_ids",
  debounceMs: 200,
  maxPerOrder: 20,
}

function getConfig(): PromptConfig {
  try {
    if (typeof window !== "undefined" && (window as any).__luxRatingPromptConfig) {
      const cfg = (window as any).__luxRatingPromptConfig as Partial<PromptConfig>
      return { ...DEFAULT_PROMPT_CONFIG, ...cfg }
    }
  } catch {}
  return DEFAULT_PROMPT_CONFIG
}

export default function OrderRatingPrompt() {
  const { isAuthenticated } = useAuthStore()
  const { user } = useAuthStore()
  const [queue, setQueue] = useState<string[]>([])
  const [current, setCurrent] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [cfg] = useState<PromptConfig>(() => getConfig())
  const [processedOrders] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    const handler = (e: any) => {
      const ids: string[] = Array.isArray(e?.detail?.productIds) ? e.detail.productIds : []
      if (ids.length > 0) {
        setQueue((prev) => [...prev, ...ids.map(String)])
      }
    }
    window.addEventListener('order:confirmed', handler as any)
    return () => window.removeEventListener('order:confirmed', handler as any)
  }, [])

  useEffect(() => {
    if (!cfg.enableRealtime) return
    const uid = user?.id
    if (!uid) return

    let timeout: any
    const channel = supabase
      .channel(`orders-rating-${uid}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: cfg.table, filter: `user_id=eq.${uid}` } as any,
        async (payload: any) => {
          try {
            const oldStatus = String((payload?.old?.status ?? "")).toLowerCase()
            const newStatus = String((payload?.new?.status ?? "")).toLowerCase()
            const targetStatuses = cfg.statusesToTrigger.map((s) => s.toLowerCase())
            if (oldStatus === newStatus) return
            if (!targetStatuses.includes(newStatus)) return

            const orderId = String(payload?.new?.id || "")
            if (!orderId || processedOrders.has(orderId)) return
            processedOrders.add(orderId)

            const immediateIds = Array.isArray((payload.new as any)[cfg.productIdsField])
              ? ((payload.new as any)[cfg.productIdsField] as any[])
              : null

            const collectIds = async (): Promise<string[]> => {
              if (Array.isArray(immediateIds) && immediateIds.length > 0) {
                return immediateIds.map((x) => String((x as any).product_id ?? x)).slice(0, cfg.maxPerOrder)
              }
              for (const tbl of cfg.itemsTables) {
                try {
                  const { data, error } = await supabase
                    .from(tbl)
                    .select('product_id')
                    .eq('order_id', orderId)
                    .limit(cfg.maxPerOrder)
                  if (!error && Array.isArray(data) && data.length > 0) {
                    const ids = data.map((r: any) => String(r.product_id)).filter(Boolean)
                    if (ids.length > 0) return Array.from(new Set(ids))
                  }
                } catch {}
              }
              return []
            }

            const ids = await collectIds()
            if (ids.length > 0) {
              clearTimeout(timeout)
              timeout = setTimeout(() => {
                setQueue((prev) => [...prev, ...ids])
              }, Math.max(0, cfg.debounceMs || 0))
            }
          } catch {}
        }
      )
      .subscribe()

    return () => {
      try { clearTimeout(timeout) } catch {}
      try { channel.unsubscribe() } catch {}
    }
  }, [user?.id, cfg.enableRealtime, cfg.table, cfg.statusesToTrigger.join(','), cfg.itemsTables.join(','), cfg.productIdsField, cfg.debounceMs, cfg.maxPerOrder, processedOrders])

  useEffect(() => {
    if (!current && queue.length > 0) {
      if (!isAuthenticated) {
        setAuthOpen(true)
        return
      }
      setCurrent(queue[0])
      setQueue((prev) => prev.slice(1))
    }
  }, [queue, current, isAuthenticated])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setCurrent(null)
    }
  }

  return (
    <>
      {current ? <RatingModal productId={current} open={!!current} onOpenChange={onOpenChange} /> : null}
      <AuthModal open={authOpen} onOpenChange={(o) => { setAuthOpen(o); }} />
    </>
  )
}
