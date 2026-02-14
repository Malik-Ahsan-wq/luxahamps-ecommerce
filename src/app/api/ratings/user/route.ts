import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabaseServer'

export async function GET(req: NextRequest) {
  const supabase = await getServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId') || ''
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const { data, error } = await supabase
    .from('ratings')
    .select('id,user_id,product_id,rating,review,created_at,updated_at')
    .eq('product_id', productId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  return NextResponse.json(data || null)
}
