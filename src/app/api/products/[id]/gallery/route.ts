import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('product_gallery')
      .select('image_url')
      .eq('product_id', id)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Gallery GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { images } = await req.json()
    
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    // Check if table exists first
    const { error: checkError } = await supabaseAdmin
      .from('product_gallery')
      .select('id')
      .limit(1)
    
    if (checkError && checkError.code === '42P01') {
      return NextResponse.json({ 
        error: 'Gallery table not found. Please run the database setup script first.' 
      }, { status: 400 })
    }

    // Delete existing gallery images for this product
    await supabaseAdmin
      .from('product_gallery')
      .delete()
      .eq('product_id', id)

    // Insert new gallery images
    const galleryData = images.map(url => ({
      product_id: id,
      image_url: url
    }))

    const { error } = await supabaseAdmin
      .from('product_gallery')
      .insert(galleryData)

    if (error) {
      console.error('Gallery insert error:', error)
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery POST Error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to save gallery' 
    }, { status: 500 })
  }
}