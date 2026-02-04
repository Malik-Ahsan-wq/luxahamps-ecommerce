'use client'
import { Search, ChevronDownIcon, Gift, User, Heart, ShoppingCart, Menu, X, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { Badge } from '@/components/ui/badge'
import AuthModal from '@/components/AuthModal'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { openCart, getCartItemsCount } = useCartStore();
  const cartCount = getCartItemsCount();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* TOP INFO BAR */}
      <div className="hidden md:flex gap-10 bg-black text-white text-xs px-9 py-3 justify-between items-center ">
        <div className="hidden md:block ">
          Rated 4.9/5   <span className='mx-6'> •Free delivery over ₹2,500 </span>    •5–7 Days delivery •Use code <span className="font-semibold ml-8">LOVEH10</span>
        </div>

        <div className="flex items-center gap-10">
          <span className="hidden sm:block">Help & Support:</span>
          <span>+91 805 888 9977</span>
          <span className="hidden sm:block">support@luxahamp.com</span>
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
              <Link href="/gift-builder" className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors flex items-center gap-1">
                <Gift className="w-4 h-4" /> MAKE YOUR GIFT
              </Link>
              <Link href="/admin" className="text-sm font-medium hover:text-pink-600 transition-colors flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> ADMIN
              </Link>
            </div>

            {/* ICONS (ALWAYS VISIBLE) */}
            <div className="flex items-center gap-4">
              <Search
                className="w-5 h-5 cursor-pointer"
                onClick={() => setSearchOpen(true)}
              />
              
              <div onClick={() => setIsAuthModalOpen(true)}>
                <User className="w-5 h-5 cursor-pointer hover:text-pink-600" />
              </div>
              
              <Heart className="w-5 h-5 cursor-pointer hover:text-pink-600" />
              
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
              <Link href="/admin" className="block text-lg font-medium hover:text-pink-600 border-b pb-2" onClick={() => setOpen(false)}>ADMIN</Link>
             </div>

             <div className="pt-4">
                <button 
                  onClick={() => {
                    setOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-3 text-gray-700 hover:bg-gray-50 mb-4"
                >
                  <User className="w-5 h-5" /> Login / Sign Up
                </button>
                
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
