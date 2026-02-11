'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { signInWithEmail, signUpWithEmail, signInWithGoogle, getCurrentSession, useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthModal({ open, onOpenChange }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const s = await getCurrentSession()
      if (s?.user) {
        useAuthStore.getState().setSession(
          { id: s.user.id, email: s.user.email ?? null, name: s.user.user_metadata?.name ?? null, avatar_url: s.user.user_metadata?.avatar_url ?? null },
          s.access_token || ''
        )
      }
    })()
  }, [])

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      if (!isConfigured) {
        setError('Supabase is not configured')
        return
      }
      if (mode === 'login') {
        await signInWithEmail(email, password)
        onOpenChange(false)
        router.push('/account')
      } else {
        await signUpWithEmail(email, password)
        setMode('login')
      }
    } catch (e: any) {
      setError(e.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    try {
      if (!isConfigured) {
        setError('Supabase is not configured')
        return
      }
      await signInWithGoogle(`${window.location.origin}/account`)
    } catch (e: any) {
      setError(e.message || 'Authentication error')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Login' : 'Sign Up'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button className="w-full" onClick={handleSubmit} disabled={loading || !email || !password}>{mode === 'login' ? 'Continue' : 'Create Account'}</Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogle} disabled={!isConfigured}>
            <span className="inline-block h-4 w-4">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.64-.22-2.43H12v4.61h6.45c-.28 1.5-1.12 2.77-2.39 3.62v3h3.88c2.27-2.09 3.55-5.18 3.55-8.8z"/>
                <path fill="#34A853" d="M12 24c3.22 0 5.93-1.07 7.91-2.93l-3.88-3c-1.08.73-2.47 1.17-4.03 1.17-3.09 0-5.72-2.08-6.66-4.88H1.33v3.06C3.3 21.33 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.34 14.36A7.27 7.27 0 014.96 12c0-.82.14-1.62.38-2.36V6.58H1.33A12 12 0 000 12c0 1.93.46 3.76 1.33 5.42l4.01-3.06z"/>
                <path fill="#EA4335" d="M12 4.73c1.75 0 3.34.6 4.58 1.77l3.42-3.42C17.94 1.13 15.22 0 12 0 7.31 0 3.3 2.67 1.33 6.58l4.01 3.06C6.28 6.8 8.91 4.73 12 4.73z"/>
              </svg>
            </span>
            Continue with Google
          </Button>
          <div className="text-sm text-center">
            {mode === 'login' ? (
              <button className="text-pink-600" onClick={() => setMode('signup')}>Create an account</button>
            ) : (
              <button className="text-pink-600" onClick={() => setMode('login')}>Already have an account? Login</button>
            )}
          </div>
          {isAuthenticated && <div className="text-green-600 text-sm text-center">Logged in</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
