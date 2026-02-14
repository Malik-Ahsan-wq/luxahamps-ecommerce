import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const body = await req.json()
  const updates: any = {}
  if ('title' in body) updates.title = body.title
  if ('description' in body) updates.description = body.description
  if ('price' in body) updates.price = typeof body.price === 'number' ? body.price : Number(body.price)
  if ('image' in body) updates.image = body.image
  if ('category' in body) updates.category = body.category
  if ('stock' in body) updates.stock = typeof body.stock === 'number' ? body.stock : Number(body.stock)
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select('id,title,description,price,image,category,stock,created_at,average_rating')
    .single()
  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  const p = {
    id: String(data.id),
    name: data.title || '',
    price: Number(data.price) || 0,
    category: data.category || '',
    image: data.image || '',
    colors: [],
    sizes: [],
    inStock: Number(data.stock || 0) > 0,
    description: data.description || '',
    createdAt: data.created_at || null,
    averageRating: Number((data as any).average_rating || 0),
  }
  return NextResponse.json(p)
}

export async function DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
