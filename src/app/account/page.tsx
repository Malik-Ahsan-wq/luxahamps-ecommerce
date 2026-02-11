'use client'
import { useEffect, useState } from 'react'
  import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore, updateProfile, signOut, getCurrentSession } from '@/store/useAuthStore'

export default function AccountPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar_url || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const s = await getCurrentSession()
      if (!s?.user) {
        router.replace('/')
      } else {
        const u = s.user
        setName(u.user_metadata?.name || '')
        setAvatar(u.user_metadata?.avatar_url || '')
        useAuthStore.getState().setSession(
          { id: u.id, email: u.email ?? null, name: u.user_metadata?.name ?? null, avatar_url: u.user_metadata?.avatar_url ?? null },
          s.access_token || ''
        )
      }
    })()
  }, [router])

  const onSave = async () => {
    setError(null)
    setSuccess(null)
    setSaving(true)
    try {
      await updateProfile({ name, avatar_url: avatar })
      setSuccess('Profile updated')
    } catch (e: any) {
      setError(e.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const onLogout = async () => {
    await signOut()
    router.replace('/')
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              {avatar ? (
                <img src={avatar} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-900 text-white text-xl font-bold flex items-center justify-center">
                  {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="text-lg font-bold">{user?.name || 'Your Name'}</div>
                <div className="text-sm text-gray-600">{user?.email || 'your@email.com'}</div>
              </div>
              <Button variant="outline" onClick={onLogout}>Sign out</Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button onClick={onSave} disabled={saving}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
