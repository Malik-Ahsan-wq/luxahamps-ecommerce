import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
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
    stock: Number(p.stock || 0),
    galleryImages: Array.isArray(p.gallery_images) ? p.gallery_images : [],
  }))
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { title, description, price, image, category, stock, gallery_images } = body || {}
  if (!title) {
    return NextResponse.json({ error: 'Missing title' }, { status: 400 })
  }
  const priceNum = typeof price === 'number' ? price : Number(price)
  if (Number.isNaN(priceNum)) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
  }
  const img = image || ''
  const stockVal = typeof stock === 'number' ? stock : (stock ? Number(stock) : 0)
  const galleryUrls = Array.isArray(gallery_images) ? gallery_images : []
  
  console.log('Inserting product with gallery_images:', galleryUrls)
  
  const insertData: any = { 
    title, 
    description: description || '', 
    price: priceNum, 
    image: img, 
    category: category || '', 
    stock: stockVal,
    gallery_images: galleryUrls
  }
  
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(insertData)
    .select('*')
    .single()
  if (error) {
    console.error('Insert error:', error)
    return NextResponse.json({ error: error.message || 'Insert failed' }, { status: 500 })
  }
  
  console.log('Product inserted, gallery_images in DB:', data.gallery_images)
  
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
    stock: Number(data.stock || 0),
    galleryImages: Array.isArray(data.gallery_images) ? data.gallery_images : [],
  }
  return NextResponse.json(p, { status: 201 })
}
