import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const BUCKET = 'product-images'

async function ensureBucket() {
  try {
    const { data: buckets } = await (supabaseAdmin as any).storage.listBuckets()
    const exists = Array.isArray(buckets) && buckets.some((b: any) => b.name === BUCKET)
    if (!exists) {
      await (supabaseAdmin as any).storage.createBucket(BUCKET, { public: true })
    }
  } catch {}
}

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: productId } = await ctx.params
  try {
    const { data, error } = await supabaseAdmin
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: true })
    if (error) {
      // Graceful fallback if table missing or other schema issue
      return NextResponse.json([], { status: 200 })
    }
    const items = (data || []).map((r: any) => ({
      id: r.id,
      product_id: r.product_id,
      image_url: r.image_url || r.url || '',
      color_variant: r.color_variant ?? r.color ?? null,
      created_at: r.created_at || null,
    })).filter((x: any) => x.image_url)
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: productId } = await ctx.params
  await ensureBucket()
  const form = await req.formData()
  const color = (form.get('color') as string) || null
  const files = form.getAll('files')
  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })
  }

  const uploaded: Array<{ id: string; image_url: string }> = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!(file instanceof File)) continue
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const key = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const { error: upErr } = await (supabaseAdmin as any).storage.from(BUCKET).upload(key, Buffer.from(arrayBuffer), {
      contentType: file.type || 'image/jpeg',
      upsert: false,
      cacheControl: '3600'
    })
    if (upErr) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
    const { data: publicUrlData } = (supabaseAdmin as any).storage.from(BUCKET).getPublicUrl(key)
    const image_url: string = publicUrlData?.publicUrl || ''
    if (!image_url) {
      return NextResponse.json({ error: 'Failed to get public URL' }, { status: 500 })
    }
    // Insert row; be tolerant if column name differs ('color' vs 'color_variant')
    const basePayload: any = { product_id: productId, image_url }
    if (color) basePayload.color_variant = color
    let row: any = null
    {
      const { data: r1, error: e1 } = await supabaseAdmin
        .from('product_images')
        .insert(basePayload)
        .select('id,image_url')
        .single()
      if (e1) {
        // Fallback try with 'color' column
        const altPayload: any = { product_id: productId, image_url }
        if (color) altPayload.color = color
        const { data: r2, error: e2 } = await supabaseAdmin
          .from('product_images')
          .insert(altPayload)
          .select('id,image_url')
          .single()
        if (e2) {
          try { await (supabaseAdmin as any).storage.from(BUCKET).remove([key]) } catch {}
          return NextResponse.json({ error: 'Failed to save image record' }, { status: 500 })
        }
        row = r2
      } else {
        row = r1
      }
    }
    uploaded.push({ id: String(row.id), image_url })
  }

  return NextResponse.json({ uploaded }, { status: 201 })
}
