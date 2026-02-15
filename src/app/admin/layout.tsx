"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const sidebarItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Products", href: "/admin/products", icon: Package },
    { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { title: "Ratings", href: "/admin/ratings", icon: Star },
  ];

  useEffect(() => {
    try {
      const session = typeof window !== "undefined" ? localStorage.getItem("admin_session") : null;
      const isLogin = pathname === "/admin";
      if (!session && !isLogin) {
        router.replace("/admin");
      }
      if (session && isLogin) {
        router.replace("/admin/dashboard");
      }
    } catch {}
  }, [pathname, router]);

  // Shared Sidebar UI
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full bg-blue-100">
      {/* Branding Area */}
      <div className="flex h-20 items-center border-b border-slate-100 px-8 bg-gradient-to-b from-slate-50/50 to-transparent">
        {isMobile ? (
          <SheetHeader>
            <SheetTitle asChild>
              <Link 
                href="/" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 transition-transform hover:scale-105 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight text-slate-900 leading-none">Admin Panel</span>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Enterprise v3.0</span>
                </div>
              </Link>
            </SheetTitle>
          </SheetHeader>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-3 transition-transform hover:scale-105 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-none">Admin Panel</span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Enterprise v3.0</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1 justify-between p-4">
        <nav className="space-y-1.5">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
            Main Menu
          </p>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100 ring-1 ring-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                )} />
                {item.title}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-slate-100 pt-4 px-2">
          <Link href="/" className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl px-4 py-6 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <LogOut className="h-4 w-4" />
              </div>
              Exit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex w-72 flex-col border-r border-slate-200 bg-blue-100 backdrop-blur-xl sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="flex h-16 items-center border-b border-slate-200 bg-white/50 px-4 md:px-8 backdrop-blur-md md:h-20 sticky top-0 z-40">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-6 w-6 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-none">
                <SidebarContent isMobile />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2 font-black italic text-blue-600">
              <Package className="h-5 w-5" />
              <span className="text-slate-900 not-italic">Admin</span>
            </div>
          </div>

          {/* Right side user info */}
          <div className="ml-auto flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 border-2 border-white shadow-sm" />
            <span className="text-sm font-bold text-slate-700 hidden sm:inline-block">System Admin</span>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
