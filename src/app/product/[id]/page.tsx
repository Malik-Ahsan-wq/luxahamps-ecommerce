"use client";

import { useParams } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { useProductStore } from "@/store/useProductStore";
import { useEffect, useMemo } from "react";
import { Product } from "@/store/useQuickViewStore";
import { JsonLd } from "@/components/JsonLd";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;
  const { products, loadProducts } = useProductStore();

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const product = useMemo<Product | null>(() => {
    if (!id) return null
    const foundProduct = products.find((p) => p.id === id || p.id.toString() === id);
    if (!foundProduct) return null
    return {
      id: foundProduct.id,
      name: foundProduct.name,
      price: foundProduct.price,
      image: foundProduct.image,
      category: foundProduct.category,
      description: foundProduct.description,
      oldPrice: Math.round(foundProduct.price * 1.25),
      discount: "25% OFF",
      stock: foundProduct.inStock ? 20 : 0
    }
  }, [id, products])

  if (!product) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description || "Premium product",
        "brand": { "@type": "Brand", "name": "Luxahamps" },
        "category": product.category,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": product.price,
          "availability": (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": `https://luxahamps-ecommerce.vercel.app/product/${product.id}`
        }
      }} />
      <ProductDetails product={product} />
    </div>
  );
}
