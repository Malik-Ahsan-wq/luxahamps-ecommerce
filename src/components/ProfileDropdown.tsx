'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function ProfileDropdown() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
      const admin = typeof window !== 'undefined' ? localStorage.getItem('admin_email') : null
      setAdminEmail(admin)
    }
    run()
  }, [])

  const logoutUser = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/user-login'
  }

  const logoutAdmin = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    localStorage.removeItem('admin_email')
    window.location.href = '/auth/admin-login'
  }

  if (!userEmail && !adminEmail) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/user-login" className="text-sm">Login</Link>
        <span className="text-slate-300">|</span>
        <Link href="/auth/admin-login" className="text-sm">Admin</Link>
      </div>
    )
  }

  return (
    <div className="relative group">
      <button className="text-sm font-medium">
        {userEmail ?? adminEmail}
      </button>
      <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border rounded shadow-md">
        {userEmail && <button className="px-4 py-2 w-full text-left hover:bg-slate-50" onClick={logoutUser}>Logout</button>}
        {adminEmail && <button className="px-4 py-2 w-full text-left hover:bg-slate-50" onClick={logoutAdmin}>Logout</button>}
      </div>
    </div>
  )
}
