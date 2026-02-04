'use client'
import { Search,ChevronDownIcon , Gift, User, Heart, ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
const [searchOpen, setSearchOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* TOP INFO BAR */}
      <div className="hidden md:flex gap10 bg-black text-white text-xs px-9 py-3 justify-between items-center ">

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
      <header className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* LEFT: LOGO */}
          <img
            src="/assets/mainlogo.cb44b92e.svg"
            alt="luxahamp"
            className="h-10"
          />

          {/* RIGHT: MENU + ICONS */}
          <div className="flex items-center gap-8">
            
            {/* DESKTOP MENU (RIGHT SIDE, NOT CENTER) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#" className="hover:text-pink-600">HOME</a>

           <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Link with arrow */}
      <a
        href="#"
        className="hover:text-pink-600 flex items-center gap-1 font-medium"
      >
        SHOP
        <ChevronDownIcon className="w-4 h-4 transition-transform duration-300" 
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} 
        />
      </a>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
          <a
            href="#"
            className="block px-4 py-2 hover:bg-pink-100 text-gray-700"
          >
            Category 1
          </a>
          <a
            href="#"
            className="block px-4 py-2 hover:bg-pink-100 text-gray-700"
          >
            Category 2
          </a>
          <a
            href="#"
            className="block px-4 py-2 hover:bg-pink-100 text-gray-700"
          >
            Category 3
          </a>
        </div>
      )}
    </div>

              <button className="bg-pink-600 text-white px-5 py-2  rounded-md hover:bg-pink-700 transition">
              <Gift className="w-4 h-5 mr-1 inline-block" />  MAKE YOUR OWN
              </button>
            </nav>

            {/* ICONS (ALWAYS VISIBLE) */}
            <div className="flex items-center gap-4">
<Search
  className="w-5 h-5 cursor-pointer"
  onClick={() => setSearchOpen(true)}
/>
<div
  className={`fixed top-0 left-0 w-full z-50
  transform transition-all duration-300 ease-in-out
  ${searchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
>
  <div className="bg-white shadow-lg">
    <div className="max-w-6xl mx-auto px-6 py-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Search</h2>
        <button
          onClick={() => setSearchOpen(false)}
          className="transition-transform  cursor-pointer duration-300 hover:rotate-90"
        >
          <X />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex gap-8">

      
        

        {/* SEARCH INPUT */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-2 rounded bg-gray-200  text-lg py-3 outline-none focus:border-pink-600 transition"
            autoFocus
          />
        </div>
      </div>
    </div>
  </div>
</div>

              <User className="w-5 h-5 cursor-pointer" />
              <Heart className="w-5 h-5 cursor-pointer" />
              <ShoppingCart className="w-5 h-5 cursor-pointer" />

              {/* MOBILE MENU BUTTON */}
            <button
  className="md:hidden transition-transform  cursor-pointer duration-300 hover:rotate-90"
  onClick={() => setOpen(true)}
>
  <Menu className="w-6 h-6 transition-transform duration-300 hover:rotate-90" />
</button>

            </div>
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
        ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />

      {/* MOBILE SLIDE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-[100%] max-w-sm bg-white z-50
        transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* MOBILE HEADER */}
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <img src="/assets/mainlogo.cb44b92e.svg" className="h-8" />
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className="px-6 py-6 space-y-6 text-sm font-medium">
          <a href="#" className="block">HOME</a>
          <a href="#" className="block">SHOP</a>

          <button className="bg-pink-600 text-white px-6 py-3 rounded-md">
             MAKE YOUR OWN
          </button>
        </div>
        
      </div>
    </>
  )
}
