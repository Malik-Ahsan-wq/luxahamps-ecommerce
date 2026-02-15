import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  ArrowRight, 
  Twitter, 
  PinIcon as Pinterest 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Shop Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Shop</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium text-gray-800">
              <li className="hover:text-pink-600 cursor-pointer transition-colors">New Arrivals</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">Best Sellers</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">Bulk Order</li>
            </ul>
          </div>

          {/* Explore Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Explore</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium text-gray-800">
              <li className="hover:text-pink-600 cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">Shipping & Returns</li>
            </ul>
          </div>

          {/* More Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest">More</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium text-gray-800">
              <li className="hover:text-pink-600 cursor-pointer transition-colors">My Account</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">Contact</li>
              <li className="hover:text-pink-600 cursor-pointer transition-colors">Career</li>
            </ul>
          </div>

          {/* Newsletter Column - Spans 2 columns on large screens */}
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Exclusive Benefits</h4>
            
            {/* <div className="relative group max-w-sm">
              <input 
                type="email" 
                placeholder="Enter email here" 
                className="w-full border-b border-gray-300 py-2 pr-10 focus:outline-none focus:border-black transition-colors text-sm"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 hover:text-pink-600 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div> */}
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Apply for our free newsletter to receive exclusive deals, news, and other updates.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-6 mt-4 md:justify-end lg:justify-start">
              <Facebook size={20} className="cursor-pointer hover:text-pink-600 transition-colors" />
              <Twitter size={20} className="cursor-pointer hover:text-pink-600 transition-colors" />
              <Instagram size={20} className="cursor-pointer hover:text-pink-600 transition-colors" />
              <Pinterest size={20} className="cursor-pointer hover:text-pink-600 transition-colors" />
              <Linkedin size={20} className="cursor-pointer hover:text-pink-600 transition-colors" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs">
            TM and © {currentYear} LuxaHamp. All rights reserved.
          </p>
          
          {/* Payment Icons Placeholder */}
          <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold">VISA</div>
             <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold">MC</div>
             <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold">UPI</div>
             <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold">RuPay</div>
             <div className="w-10 h-6 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold">APay</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;