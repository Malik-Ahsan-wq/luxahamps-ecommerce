"use client"
import { Star } from "lucide-react"
import { useMemo } from "react"

type Props = {
  value: number
  size?: number
  onChange?: (v: number) => void
  readonly?: boolean
}

export default function RatingStars({ value, size = 18, onChange, readonly = false }: Props) {
  const v = useMemo(() => Math.max(0, Math.min(5, Math.round(value || 0))), [value])
  const handle = (i: number) => {
    if (readonly) return
    onChange?.(i)
  }
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => handle(i)}
          aria-label={`Rate ${i}`}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            width={size}
            height={size}
            className={i <= v ? "text-yellow-400" : "text-gray-300"}
            fill={i <= v ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  )
}
