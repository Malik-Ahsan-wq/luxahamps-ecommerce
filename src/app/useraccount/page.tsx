'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UserAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [joinDate, setJoinDate] = useState<string>('');
  const [profile, setProfile] = useState<{ name: string | null; about: string | null; avatar_url: string | null } | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<{ name: string; about: string; avatar_url: string }>({ name: '', about: '', avatar_url: '' });

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
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(u.email)}`, { cache: 'no-store' });
      const p = await res.json();
      if (p && typeof p === 'object') {
        setProfile({ name: p.name ?? null, about: p.about ?? null, avatar_url: p.avatar_url ?? null });
        setForm({ name: p.name ?? '', about: p.about ?? '', avatar_url: p.avatar_url ?? '' });
      } else {
        setProfile({ name: null, about: null, avatar_url: null });
        setForm({ name: '', about: '', avatar_url: '' });
      }
      setLoading(false);
    };
    run();
  }, [router]);

  const avatarSrc = useMemo(() => {
    return profile?.avatar_url && profile.avatar_url.length > 0 ? profile.avatar_url : '/assets/default-avatar.png';
  }, [profile]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, name: form.name, about: form.about, avatar_url: form.avatar_url }),
      });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
        setSaving(false);
        return;
      }
      setProfile({ name: data?.name ?? null, about: data?.about ?? null, avatar_url: data?.avatar_url ?? null });
      setEditing(false);
    } catch {
      setError('Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="rounded-xl bg-white shadow-sm p-6 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-blue-900 flex items-center justify-center">
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">{profile?.name ?? userEmail.split('@')[0]}</div>
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
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <div className="text-sm text-gray-600">join Date</div>
                <div className="text-base">{joinDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">About</div>
                <div className="text-base">{profile?.about ?? 'No description added.'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="text-base">{userEmail}</div>
              </div>
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
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">About</label>
                    <textarea
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      rows={4}
                      value={form.about}
                      onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Avatar URL</label>
                    <input
                      type="url"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={form.avatar_url}
                      onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
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
    </div>
  );
}
