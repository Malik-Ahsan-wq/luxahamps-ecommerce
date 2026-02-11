'use client'
import { Search, ChevronDownIcon, Gift, User, Heart, ShoppingCart, Menu, X, LayoutDashboard, LogIn } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/AuthModal'
import { useAuthStore, signOut, getCurrentSession } from '@/store/useAuthStore'
// Profile dropdown removed

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false);
  const [authOpen, setAuthOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const router = useRouter()
  const { openCart, getCartItemsCount } = useCartStore();
  const cartCount = getCartItemsCount();
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    setIsMounted(true);
    ;(async () => {
      const s = await getCurrentSession()
      if (s?.user) {
        useAuthStore.getState().setSession(
          { id: s.user.id, email: s.user.email ?? null, name: s.user.user_metadata?.name ?? null, avatar_url: s.user.user_metadata?.avatar_url ?? null },
          s.access_token || ''
        )
      }
    })()
  }, []);

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
              <div className="relative">
                {isAuthenticated ? (
                  <button
                    type="button"
                    aria-label="Open profile menu"
                    onClick={() => setProfileMenuOpen((v) => !v)}
                    className="p-0 m-0 bg-transparent border-0"
                  >
                    {user?.avatar_url ? (
                      <img src={user.avatar_url || ''} alt="profile" className="h-6 w-6 rounded-full object-cover" />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                        {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Open account"
                    onClick={() => setAuthOpen(true)}
                    className="p-0 m-0 bg-transparent border-0"
                  >
                    <User className="w-5 h-5 cursor-pointer hover:text-pink-600" />
                  </button>
                )}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-md z-50">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => { setProfileMenuOpen(false); router.push('/account') }}
                    >
                      My Account
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => { setProfileMenuOpen(false); signOut() }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
              
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

      
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  )
}
