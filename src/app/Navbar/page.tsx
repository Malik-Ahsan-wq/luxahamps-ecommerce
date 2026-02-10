'use client'
import { Search, ChevronDownIcon, Gift, User, Heart, ShoppingCart, Menu, X, LayoutDashboard, LogIn } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
// Profile dropdown removed

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isAuthed, setIsAuthed] = useState(false)

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) {
          setError(signInError.message)
          setLoading(false)
          return
        }
        const { data: userData } = await supabase.auth.getUser()
        const userId = userData.user?.id
        const userEmail = userData.user?.email ?? email
        await fetch('/api/auth/save-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, email: userEmail }),
        })
        setLoginOpen(false)
        router.push('/useraccount')
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) {
          setError(signUpError.message)
          setLoading(false)
          return
        }
        const { data: userData } = await supabase.auth.getUser()
        const userId = userData.user?.id
        const userEmail = userData.user?.email ?? email
        await fetch('/api/auth/save-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, email: userEmail }),
        })
        setLoginOpen(false)
        router.push('/useraccount')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const { openCart, getCartItemsCount } = useCartStore();
  const cartCount = getCartItemsCount();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token || ''
      const loggedIn = !!token
      setIsAuthed(loggedIn)
      if (!loggedIn) {
        setProfileImage(null)
        return
      }
      try {
        const res = await fetch('/api/user/profile', { headers: { authorization: `Bearer ${token}` }, cache: 'no-store' })
        const p = await res.json()
        if (p && typeof p === 'object' && typeof p.profile_image === 'string' && p.profile_image.length > 0) {
          setProfileImage(p.profile_image)
        } else {
          setProfileImage(null)
        }
      } catch {
        setProfileImage(null)
      }
    }
    fetchProfile()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session)
      if (!session) {
        setProfileImage(null)
        return
      }
      fetchProfile()
    })
    const onProfileUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail as any
      if (detail?.profile_image && typeof detail.profile_image === 'string') {
        setProfileImage(detail.profile_image)
      }
    }
    window.addEventListener('profile:update', onProfileUpdate as EventListener)
    return () => {
      sub?.subscription?.unsubscribe()
      window.removeEventListener('profile:update', onProfileUpdate as EventListener)
    }
  }, [])

  return (
    <>
      {/* TOP INFO BAR */}
  <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .ticker-container:hover .animate-marquee-infinite {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-container md:block hidden relative w-full overflow-hidden bg-black text-white py-3 border-b border-white/10 select-none">
        <div className="animate-marquee-infinite">
          {/* First Loop */}
          <div className="flex items-center gap-12 px-6">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-slate-300 uppercase">
              Rated 4.9/5 ★
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide">
              Free delivery over <span className="text-emerald-400 font-bold">₹2,500</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide">
              5–7 Days delivery
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide uppercase">
              Use code: <span className="bg-white text-black px-2 py-0.5 rounded-sm ml-1 font-black">LOVEH10</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide">
              Support: <span className="text-blue-400 font-bold">+91 805 888 9977</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide text-slate-300">
              support@luxahamp.com
            </span>
          </div>

          {/* Second Loop (Exact Duplicate for Seamless Transition) */}
          <div className="flex items-center gap-12 px-6" aria-hidden="true">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-slate-300 uppercase">
              Rated 4.9/5 ★
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide">
              Free delivery over <span className="text-emerald-400 font-bold">₹2,500</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide">
              5–7 Days delivery
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide uppercase">
              Use code: <span className="bg-white text-black px-2 py-0.5 rounded-sm ml-1 font-black">LOVEH10</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide">
              Support: <span className="text-blue-400 font-bold">03276227156</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-500" />
            <span className="text-[10px] md:text-xs font-medium tracking-wide text-slate-300">
www.ahsanmalik.xyz            </span>
          </div>
        </div>
      </div>
   

      {/* MAIN NAVBAR */}
      <header className="shadow-sm sticky top-0 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* LEFT: LOGO */}
          <Link href="/">
            <img
              src="/assets/mainlogo.cb44b92e.svg"
              alt="luxahamp"
              className="h-10"
            />
          </Link>

          {/* RIGHT: MENU + ICONS */}
          <div className="flex items-center gap-8">
            
            {/* DESKTOP MENU (RIGHT SIDE, NOT CENTER) */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium hover:text-pink-600 transition-colors">HOME</Link>
              <Link href="/products" className="text-sm font-medium hover:text-pink-600 transition-colors">SHOP</Link>
              <Link href="/gift-builder" className="text-sm font-medium bg-pink-600 p-2 rounded text-white hover:bg-pink-700 transition-colors flex items-center gap-1">
                <Gift className="w-4 h-4" /> MAKE YOUR GIFT
              </Link>
            </div>

            {/* ICONS (ALWAYS VISIBLE) */}
            <div className="flex items-center gap-4">
              <Search
                className="w-5 h-5 cursor-pointer"
                onClick={() => setSearchOpen(true)}
              />
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-5 h-5 rounded-full object-cover cursor-pointer"
                  onClick={() => router.push('/useraccount')}
                />
              ) : (
                <button
      type="button"
      aria-label="Open signup"
      onClick={() => router.push("/login")}
      className="p-0 m-0 bg-transparent border-0"
    >
      <LogIn className="w-5 h-5 cursor-pointer hover:text-pink-600" />
    </button>
              )}
              
              {/* <Heart className="w-5 h-5 cursor-pointer hover:text-pink-600" /> */}
              
              <div className="relative cursor-pointer" onClick={openCart}>
                <ShoppingCart className="w-5 h-5 hover:text-pink-600" />
                {isMounted && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden" onClick={() => setOpen(!open)}>
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white z-50 overflow-y-auto">
          <div className="p-4 space-y-6">
             <div className="space-y-4">
              <Link href="/" className="block text-lg font-medium hover:text-pink-600 border-b pb-2" onClick={() => setOpen(false)}>HOME</Link>
              <Link href="/products" className="block text-lg font-medium hover:text-pink-600 border-b pb-2" onClick={() => setOpen(false)}>SHOP</Link>
              <Link href="/gift-builder" className="block text-lg font-medium text-pink-600 hover:text-pink-700 border-b pb-2 flex items-center gap-2" onClick={() => setOpen(false)}>
                <Gift className="w-5 h-5" /> MAKE YOUR GIFT
              </Link>
             </div>

             <div className="pt-4">
               <Link 
                 href="/gift-builder"
                 onClick={() => setOpen(false)}
                 className="w-full bg-pink-600 text-white px-5 py-3 rounded-md hover:bg-pink-700 transition flex items-center justify-center"
               >
                 <Gift className="w-5 h-5 mr-2" />  MAKE YOUR OWN
               </Link>
             </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      <div
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md p-4 flex items-center gap-4 transform transition-all duration-300 ease-in-out ${searchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
         <Search className="w-5 h-5 text-gray-500" />
         <input type="text" placeholder="Search..." className="flex-1 outline-none text-lg" autoFocus={searchOpen} />
         <X className="w-6 h-6 cursor-pointer hover:text-red-500" onClick={() => setSearchOpen(false)} />
      </div>

      {loginOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setLoginOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {isLogin ? 'Enter your credentials' : 'Join us today'}
              </p>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>

            <form className="space-y-4" onSubmit={handleAuthSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (isLogin ? 'Signing In...' : 'Signing Up...') : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 font-bold text-blue-600 hover:underline"
                  disabled={loading}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
