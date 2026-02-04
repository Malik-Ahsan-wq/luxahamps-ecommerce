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
import { Search, Filter, X } from "lucide-react";

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
  } = useProductStore();

  const [showFilters, setShowFilters] = useState(false);

  // Initial apply (though store might handle it, good to ensure)
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-center lg:text-left">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)} 
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-64 p-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="rounded-lg border bg-white p-4 shadow-sm space-y-6 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs text-muted-foreground"
              >
                Reset
              </Button>
            </div>

            {/* Filters Grid: stacked on mobile, vertical on desktop */}
            <div className="grid grid-cols-1 gap-6">
              {/* Category */}
              <div>
                <Label className="mb-2 block">Category</Label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(val) =>
                    setFilter("category", val === "all" ? null : val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div>
                <Label className="mb-2 block">Color</Label>
                <Select
                  value={filters.color || "all"}
                  onValueChange={(val) =>
                    setFilter("color", val === "all" ? null : val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Colors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colors</SelectItem>
                    {uniqueColors.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div>
                <Label className="mb-2 block">Size</Label>
                <Select
                  value={filters.size || "all"}
                  onValueChange={(val) =>
                    setFilter("size", val === "all" ? null : val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Sizes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {uniqueSizes.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability */}
              <div>
                <Label className="mb-2 block">Availability</Label>
                <Select
                  value={
                    filters.inStock === null
                      ? "all"
                      : filters.inStock
                      ? "in-stock"
                      : "out-of-stock"
                  }
                  onValueChange={(val) =>
                    setFilter(
                      "inStock",
                      val === "all" ? null : val === "in-stock"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
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
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">Sort by:</Label>
              <Select
                value={sortOption || "newest"}
                onValueChange={(val: any) => setSortOption(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <Search className="mb-2 h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
              <Button
                variant="link"
                onClick={resetFilters}
                className="mt-2"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
