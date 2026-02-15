import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title, description, price, image, category, stock, gallery_images } = body || {}
    
    if (!title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 })
    }
    
    const priceNum = typeof price === 'number' ? price : Number(price)
    if (Number.isNaN(priceNum)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }
    
    const stockVal = typeof stock === 'number' ? stock : (stock ? Number(stock) : 0)
    const galleryUrls = Array.isArray(gallery_images) ? gallery_images : []
    
    const updateData: any = { 
      title, 
      description: description || '', 
      price: priceNum, 
      image: image || '', 
      category: category || '', 
      stock: stockVal,
      gallery_images: galleryUrls
    }
    
    console.log('Updating product with gallery_images:', galleryUrls)
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()
    
    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
    }
    
    console.log('Product updated, gallery_images in DB:', data.gallery_images)
    
    const product = {
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
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('PATCH Error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Delete gallery images first
    await supabaseAdmin
      .from('product_gallery')
      .delete()
      .eq('product_id', id)
    
    // Delete the product
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}