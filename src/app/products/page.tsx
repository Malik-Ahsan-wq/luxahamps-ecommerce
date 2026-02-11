"use client";

import React, { useEffect, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Filter, X, Grid, List } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import BrandSlider from "../BrandSlider/page";
import { JsonLd } from "@/components/JsonLd";

export default function ProductsPage() {
  const {
    filteredProducts,
    searchQuery,
    filters,
    sortOption,
    setSearchQuery,
    setFilter,
    setSortOption,
    resetFilters,
    applyFilters,
    loadProducts,
  } = useProductStore();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
    applyFilters();
  }, [applyFilters, loadProducts]);

  

  const uniqueColors = Array.from(
    new Set(useProductStore.getState().products.flatMap((p) => p.colors))
  );
  const uniqueSizes = Array.from(
    new Set(useProductStore.getState().products.flatMap((p) => p.sizes))
  );
  const uniqueCategories = Array.from(
    new Set(useProductStore.getState().products.map((p) => p.category))
  );

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://luxahamps-ecommerce.vercel.app" },
          { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://luxahamps-ecommerce.vercel.app/products" }
        ]
      }} />
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-300">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 text-center md:text-left">
            Shop Our Collection
          </h1>
          <p className="mt-2 text-gray-500 text-center md:text-left max-w-2xl">
            Explore our exclusive range of premium products, curated just for you. Find the perfect gift or treat yourself to something special.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between gap-4">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 flex items-center gap-2 border-gray-300">
                  <Filter className="w-4 h-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Category */}
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Category</Label>
                    <Select
                      value={filters.category || "all"}
                      onValueChange={(val) => setFilter("category", val === "all" ? null : val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                   {/* Color */}
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Color</Label>
                    <Select
                      value={filters.color || "all"}
                      onValueChange={(val) => setFilter("color", val === "all" ? null : val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Colors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Colors</SelectItem>
                        {uniqueColors.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Size */}
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Size</Label>
                    <Select
                      value={filters.size || "all"}
                      onValueChange={(val) => setFilter("size", val === "all" ? null : val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Sizes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        {uniqueSizes.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                   {/* Availability */}
                  <div>
                    <Label className="mb-2 block text-sm font-medium">Availability</Label>
                    <Select
                      value={filters.inStock === null ? "all" : filters.inStock ? "in-stock" : "out-of-stock"}
                      onValueChange={(val) => setFilter("inStock", val === "all" ? null : val === "in-stock")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={resetFilters} variant="destructive" className="w-full mt-4">Reset Filters</Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input 
                 placeholder="Search..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 w-full"
               />
            </div>
          </div>

          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-300 p-6 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h2>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                  Reset
                </Button>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <Label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Category</Label>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(val) => setFilter("category", val === "all" ? null : val)}
                  >
                    <SelectTrigger className="w-full border-gray-300">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-300 cursor-pointer">
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color */}
                <div>
                  <Label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Color</Label>
                  <Select
                    value={filters.color || "all"}
                    onValueChange={(val) => setFilter("color", val === "all" ? null : val)}
                  >
                    <SelectTrigger className="w-full border-gray-300">
                      <SelectValue placeholder="All Colors" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-300 cursor-pointer">
                      <SelectItem value="all">All Colors</SelectItem>
                      {uniqueColors.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Size */}
                <div>
                  <Label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Size</Label>
                  <Select
                    value={filters.size || "all"}
                    onValueChange={(val) => setFilter("size", val === "all" ? null : val)}
                  >
                    <SelectTrigger className="w-full border-gray-300">
                      <SelectValue placeholder="All Sizes" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-300 cursor-pointer">
                      <SelectItem value="all">All Sizes</SelectItem>
                      {uniqueSizes.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability */}
                <div>
                  <Label className="mb-2 block text-xs font-semibold uppercase text-gray-500">Availability</Label>
                  <Select
                    value={filters.inStock === null ? "all" : filters.inStock ? "in-stock" : "out-of-stock"}
                    onValueChange={(val) => setFilter("inStock", val === "all" ? null : val === "in-stock")}
                  >
                    <SelectTrigger className="w-full border-gray-300">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-300 cursor-pointer">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-300 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-4">
                 <div className=" ml-3 text-sm text-gray-500">
 <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
                 </div>
                 <div className="h-6 w-px bg-gray-200"></div>
                 <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                  <Select
                    value={sortOption || "newest"}
                    onValueChange={(val: any) => setSortOption(val)}
                  >
                    <SelectTrigger className="w-[180px] border border-gray-300 shadow-none  hover:bg-gray-50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent align="end" className="bg-blue-300 cursor-pointer">
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid md:w-3xl grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-dashed border-gray-300">
                <div className="rounded-full bg-gray-50 p-6 mb-4">
                   <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                  We couldn't find any products matching your search or filters. Try adjusting your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mt-6"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <BrandSlider/>
    </div>
  );
}
