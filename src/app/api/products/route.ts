import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,title,description,price,image,category,stock,created_at,average_rating')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  const items = (data || []).map((p: any) => ({
    id: String(p.id),
    name: p.title || '',
    price: Number(p.price) || 0,
    category: p.category || '',
    image: p.image || '',
    colors: [],
    sizes: [],
    inStock: Number(p.stock || 0) > 0,
    description: p.description || '',
    createdAt: p.created_at || null,
    averageRating: Number(p.average_rating || 0),
  }))
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { title, description, price, image, category, stock } = body || {}
  if (!title) {
    return NextResponse.json({ error: 'Missing title' }, { status: 400 })
  }
  const priceNum = typeof price === 'number' ? price : Number(price)
  if (Number.isNaN(priceNum)) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
  }
  const img = image || ''
  const stockVal = typeof stock === 'number' ? stock : (stock ? Number(stock) : 0)
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({ title, description: description || '', price: priceNum, image: img, category: category || '', stock: stockVal })
    .select('id,title,description,price,image,category,stock,created_at,average_rating')
    .single()
  if (error) return NextResponse.json({ error: error.message || 'Insert failed' }, { status: 500 })
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
  return NextResponse.json(p, { status: 201 })
}
