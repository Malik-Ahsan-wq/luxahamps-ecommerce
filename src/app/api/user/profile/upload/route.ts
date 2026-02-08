import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!token) {
      return NextResponse.json({ error: 'Missing auth token' }, { status: 401 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    const supabase = createClient(url, serviceKey)

    const { data: userData, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !userData?.user?.id) {
      return NextResponse.json({ error: 'Invalid user token' }, { status: 401 })
    }
    const userId = userData.user.id

    const bucket = 'profile-images'
    // Ensure bucket exists and is public
    try {
      await supabase.storage.createBucket(bucket, { public: true })
    } catch {}

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${userId}/${Date.now()}.${ext}`
    const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, await file.arrayBuffer(), {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    })
    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 400 })
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path)
    const publicUrl = publicUrlData.publicUrl

    // Save to profiles.profile_image
    const { error: upsertErr } = await supabase
      .from('profiles')
      .update({ profile_image: publicUrl })
      .eq('id', userId)
    if (upsertErr) {
      return NextResponse.json({ error: upsertErr.message }, { status: 400 })
    }

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 400 })
  }
}
