'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {Pencil,Calendar,User, Mail, Phone, MapPin} from 'lucide-react'
import { Button } from '@/components/ui/button';
import BrandSlider from '../BrandSlider/page';

export default function UserAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [joinDate, setJoinDate] = useState<string>('');
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null; address: string | null; profile_image: string | null } | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<{ full_name: string; phone: string; address: string; profile_image: string }>({ full_name: '', phone: '', address: '', profile_image: '' });
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (!u?.email) {
        router.push('/sign-up');
        return;
      }
      setUserEmail(u.email);
      setJoinDate(new Date(u.created_at ?? new Date()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }));
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token || ''
      const res = await fetch(`/api/user/profile`, { cache: 'no-store', headers: { authorization: `Bearer ${token}` } });
      const p = await res.json();
      if (p && typeof p === 'object') {
        setProfile({ full_name: p.full_name ?? null, phone: p.phone ?? null, address: p.address ?? null, profile_image: p.profile_image ?? null });
        setForm({ full_name: p.full_name ?? '', phone: p.phone ?? '', address: p.address ?? '', profile_image: p.profile_image ?? '' });
      } else {
        setProfile({ full_name: null, phone: null, address: null, profile_image: null });
        setForm({ full_name: '', phone: '', address: '', profile_image: '' });
      }
      setLoading(false);
    };
    run();
  }, [router]);

  const avatarSrc = useMemo(() => {
    return profile?.profile_image && profile.profile_image.length > 0 ? profile.profile_image : '/assets/default-avatar.png';
  }, [profile]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      let uploadedUrl = form.profile_image
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token || ''
      const { data: userData } = await supabase.auth.getUser()
      const u = userData.user
      if (!u?.id || !u.email) {
        setError('Not authenticated')
        setSaving(false)
        return
      }
      const file = fileInputRef.current?.files?.[0] || null
      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        const up = await fetch('/api/user/profile/upload', {
          method: 'POST',
          headers: { authorization: `Bearer ${token}` },
          body: fd
        })
        const upData = await up.json()
        if (upData?.error) {
          setError(upData.error)
          setSaving(false)
          return
        }
        uploadedUrl = upData.url || uploadedUrl
      }

      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: u.id, email: u.email, full_name: form.full_name, phone: form.phone, address: form.address, profile_image: uploadedUrl }),
      });
      const respData = await res.json();
      if (respData?.error) {
        setError(respData.error);
        setSaving(false);
        return;
      }
      setProfile({ full_name: respData?.full_name ?? null, phone: respData?.phone ?? null, address: respData?.address ?? null, profile_image: respData?.profile_image ?? null });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('profile:update', { detail: { profile_image: respData?.profile_image, full_name: respData?.full_name } }))
      }
      setEditing(false);
    } catch {
      setError('Unable to save profile');
    } finally {
      setSaving(false);
    }
  };
  
  const onSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
   <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
  <div className="relative flex items-center justify-center">
    {/* Outer Glowing Ring */}
    <div className="absolute h-16 w-16 animate-ping rounded-full bg-pink-400 opacity-20"></div>
    
    {/* Inner Spinning Ring */}
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-pink-400"></div>
    
    {/* Center Logo or Icon (Optional) */}
    <div className="absolute">
       <div className="h-2 w-2 rounded-full bg-pink-500"></div>
    </div>
  </div>

  {/* Professional Text Treatment */}
  <div className="flex flex-col items-center">
    <h3 className="text-lg font-semibold tracking-tight text-gray-800">
      Authenticating
    </h3>
    <p className="text-sm font-medium text-gray-400 animate-pulse">
      Please wait a moment...
    </p>
  </div>
</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
            <div className="rounded-xl bg-white border border-pink-400 shadow-lg p-6 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-blue-900 flex items-center justify-center">
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">{profile?.full_name ?? userEmail.split('@')[0]}</div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <Link href="/useraccount" className="block w-full">
              <div className="w-full rounded-md px-4 py-3 bg-black text-white text-sm font-bold">MY PROFILE</div>
            </Link>
            <Link href="/orders" className="block w-full">
              <div className="w-full rounded-md px-4 py-3 bg-gray-100 text-gray-800 text-sm font-medium">MY ORDERS</div>
            </Link>
       
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="rounded-xl bg-white shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">Profile</div>
              <div className="flex gap-3">
              <button
  onClick={() => setEditing(true)}
  className="flex items-center justify-center gap-2 rounded-xl bg-pink-400 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition-all duration-200 hover:bg-pink-500 hover:shadow-pink-300 active:scale-95 group"
>
  <Pencil size={16} className="transition-transform group-hover:rotate-12" />
  <span>Edit Profile</span>
</button>
             <button
  onClick={onSignOut}
  className="group relative flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-white px-6 py-2.5 text-sm font-bold text-pink-500 transition-all duration-200 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 active:scale-95 shadow-sm"
>
  {/* Logout Icon */}
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className="h-4 w-4 transition-transform group-hover:-translate-x-1"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
  
  Sign Out
</button>
              </div>
            </div>
           <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
  {/* Profile Item Card */}
  {[
    { label: 'Join Date', value: joinDate, icon: Calendar },
    { label: 'Full Name', value: profile?.full_name ?? userEmail.split('@')[0], icon: User },
    { label: 'Email', value: userEmail, icon: Mail, fullWidth: true },
    { label: 'Phone', value: profile?.phone ?? '—', icon: Phone },
    { label: 'Address', value: profile?.address ?? '—', icon: MapPin },
  ].map((item, index) => (
    <div 
      key={index} 
      className={`group rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-pink-200 hover:bg-white hover:shadow-md hover:shadow-pink-50 ${item.fullWidth ? 'sm:col-span-2' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Icon Wrapper */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pink-400 shadow-sm transition-colors group-hover:bg-pink-400 group-hover:text-white">
          <item.icon size={18} />
        </div>
        
        {/* Text Content */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {item.label}
          </p>
          <p className="text-sm font-semibold text-gray-700 sm:text-base">
            {item.value}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>
          </div>

          {editing && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold">Edit Profile</div>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => setEditing(false)}>✕</button>
                </div>
                {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
                <form className="space-y-4" onSubmit={onSave}>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.full_name}
                      onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Profile Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <BrandSlider/>
    </div>
  );
}
