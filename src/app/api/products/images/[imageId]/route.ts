import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const BUCKET = 'product-images'

export async function DELETE(_: NextRequest, ctx: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await ctx.params
  const { data: row, error } = await supabaseAdmin
    .from('product_images')
    .select('id, image_url')
    .eq('id', imageId)
    .maybeSingle()
  if (error) return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  if (!row) return NextResponse.json({ ok: true })

  // best-effort to remove from storage (derive path from public URL)
  try {
    const url: string = (row as any).image_url || ''
    const idx = url.indexOf('/storage/v1/object/public/')
    if (idx >= 0) {
      const path = url.substring(idx + '/storage/v1/object/public/'.length)
      const pieces = path.split('/')
      // remove leading bucket segment
      const key = pieces.slice(1).join('/')
      await (supabaseAdmin as any).storage.from(BUCKET).remove([key])
    }
  } catch {}

  const { error: delErr } = await supabaseAdmin.from('product_images').delete().eq('id', imageId)
  if (delErr) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
