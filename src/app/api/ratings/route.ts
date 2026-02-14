import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId') || ''
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Number(searchParams.get('pageSize') || '10')
  const sort = searchParams.get('sort') || 'newest'
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let query = supabaseAdmin
    .from('ratings')
    .select('id,user_id,product_id,rating,review,created_at,updated_at', { count: 'exact' })
    .eq('product_id', productId)
  if (sort === 'highest') query = query.order('rating', { ascending: false }).order('created_at', { ascending: false })
  else if (sort === 'lowest') query = query.order('rating', { ascending: true }).order('created_at', { ascending: false })
  else query = query.order('created_at', { ascending: false })
  const { data, error, count } = await query.range(from, to)
  if (error) return NextResponse.json({ error: 'Failed to load ratings' }, { status: 500 })
  const ids = Array.from(new Set((data || []).map((r: any) => r.user_id).filter(Boolean)))
  const users: Record<string, { id: string; email?: string | null; name?: string | null; avatar_url?: string | null }> = {}
  for (const id of ids) {
    try {
      const { data: u } = await supabaseAdmin.auth.admin.getUserById(id)
      users[id] = {
        id,
        email: u?.user?.email ?? null,
        name: (u?.user?.user_metadata as any)?.name ?? null,
        avatar_url: (u?.user?.user_metadata as any)?.avatar_url ?? null,
      }
    } catch {}
  }
  return NextResponse.json({
    items: (data || []).map((r: any) => ({
      ...r,
      user: users[r.user_id] || { id: r.user_id },
    })),
    page,
    pageSize,
    total: count || 0,
  })
}

export async function POST(req: NextRequest) {
  const supabase = await getServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { productId, rating, review } = body || {}
  if (!productId || typeof rating !== 'number') {
    return NextResponse.json({ error: 'Missing productId or rating' }, { status: 400 })
  }
  const r = Math.max(1, Math.min(5, Math.round(rating)))
  const { data, error } = await supabase
    .from('ratings')
    .upsert(
      { user_id: user.id, product_id: productId, rating: r, review: review || null, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,product_id' }
    )
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
