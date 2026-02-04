"use client";

import { useParams } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { useProductStore } from "@/store/useProductStore";
import { useEffect, useState } from "react";
import { Product } from "@/store/useQuickViewStore";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;
  const { products } = useProductStore();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find((p) => p.id === id || p.id.toString() === id);
      if (foundProduct) {
        // Transform to match ProductDetails expected interface (adding mock data for UI consistency)
        const transformedProduct: Product = {
          id: foundProduct.id,
          name: foundProduct.name,
          price: foundProduct.price,
          image: foundProduct.image,
          category: foundProduct.category,
          description: foundProduct.description,
          // Mock fields to match ProductCard appearance
          oldPrice: Math.round(foundProduct.price * 1.25),
          discount: "25% OFF",
          stock: foundProduct.inStock ? 20 : 0
        };
        setProduct(transformedProduct);
      }
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <ProductDetails product={product} />
    </div>
  );
}
