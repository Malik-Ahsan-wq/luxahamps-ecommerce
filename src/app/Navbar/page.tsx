'use client'
import { Search, ChevronDownIcon, Gift, User, Heart, ShoppingCart, Menu, X, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { Badge } from '@/components/ui/badge'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
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
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="hover:text-pink-600">HOME</Link>

              <div
                className="relative"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                {/* Link with arrow */}
                <Link
                  href="/products"
                  className="hover:text-pink-600 flex items-center gap-1 font-medium"
                >
                  SHOP
                  <ChevronDownIcon className="w-4 h-4 transition-transform duration-300" 
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} 
                  />
                </Link>

                {/* Dropdown menu */}
                {isOpen && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                    <Link
                      href="/products"
                      className="block px-4 py-2 hover:bg-pink-100 text-gray-700"
                    >
                      All Products
                    </Link>
                    <Link
                      href="/products"
                      className="block px-4 py-2 hover:bg-pink-100 text-gray-700"
                    >
                      Clothing
                    </Link>
                    <Link
                      href="/products"
                      className="block px-4 py-2 hover:bg-pink-100 text-gray-700"
                    >
                      Accessories
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/admin" className="hover:text-pink-600 flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />
                ADMIN
              </Link>

              <button className="bg-pink-600 text-white px-5 py-2  rounded-md hover:bg-pink-700 transition flex items-center">
                <Gift className="w-4 h-5 mr-1 inline-block" />  MAKE YOUR OWN
              </button>
            </nav>

            {/* ICONS (ALWAYS VISIBLE) */}
            <div className="flex items-center gap-4">
              <Search
                className="w-5 h-5 cursor-pointer"
                onClick={() => setSearchOpen(true)}
              />
              
              <Link href="/admin">
                <User className="w-5 h-5 cursor-pointer hover:text-pink-600" />
              </Link>
              
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
        <div className="md:hidden bg-white border-t p-4 space-y-4 absolute w-full z-50 shadow-lg">
          <Link href="/" className="block font-medium hover:text-pink-600" onClick={() => setOpen(false)}>HOME</Link>
          <Link href="/products" className="block font-medium hover:text-pink-600" onClick={() => setOpen(false)}>SHOP</Link>
          <Link href="/admin" className="block font-medium hover:text-pink-600" onClick={() => setOpen(false)}>ADMIN</Link>
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
    </>
  )
}
