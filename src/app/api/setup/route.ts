import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST() {
  try {
    // Try to insert a test record to see if table exists
    const { error: testError } = await supabaseAdmin
      .from('product_gallery')
      .select('id')
      .limit(1)
    
    if (testError && testError.code === '42P01') {
      // Table doesn't exist, return instructions
      return NextResponse.json({ 
        error: 'Table missing',
        instructions: 'Please run the SQL script in your Supabase dashboard'
      }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Setup check failed' }, { status: 500 })
  }
}