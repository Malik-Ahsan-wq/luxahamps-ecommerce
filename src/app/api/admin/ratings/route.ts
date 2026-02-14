import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('ratings')
    .select('id,user_id,product_id,rating,review,created_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  const productIds = Array.from(new Set((data || []).map((r: any) => r.product_id)))
  const productsMap: Record<string, any> = {}
  if (productIds.length > 0) {
    const { data: prods } = await supabaseAdmin.from('products').select('id,title').in('id', productIds)
    ;(prods || []).forEach((p: any) => { productsMap[p.id] = p })
  }
  const users: Record<string, { id: string; email?: string | null; name?: string | null }> = {}
  const ids = Array.from(new Set((data || []).map((r: any) => r.user_id)))
  for (const id of ids) {
    try {
      const { data: u } = await supabaseAdmin.auth.admin.getUserById(id)
      users[id] = { id, email: u?.user?.email ?? null, name: (u?.user?.user_metadata as any)?.name ?? null }
    } catch {}
  }
  const items = (data || []).map((r: any) => ({
    ...r,
    product_title: productsMap[r.product_id]?.title || '',
    user: users[r.user_id] || { id: r.user_id }
  }))
  return NextResponse.json(items)
}
