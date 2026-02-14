import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization')
  let userId: string | null = null
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7)
    try {
      const { data: u } = await supabaseAdmin.auth.getUser(token)
      userId = u?.user?.id || null
    } catch {}
  }
  if (!userId) {
    const supabase = await getServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id || null
  }
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId') || ''
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const { data, error } = await supabaseAdmin
    .from('ratings')
    .select('id,user_id,product_id,rating,review,created_at,updated_at')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle()
  if (error) return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  return NextResponse.json(data || null)
}
