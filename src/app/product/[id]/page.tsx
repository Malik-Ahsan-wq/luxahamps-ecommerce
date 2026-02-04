"use client";

import { useParams } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { Product } from "@/store/useQuickViewStore";

// In a real app, this would come from an API or database
const products = [
  { id: 1, name: "THE PRODUCT IS FOR YOUR GIRL", price: 977, oldPrice: 1500, img: "/assets/k2wtitnfsvysr7yuop8q.webp", discount: "35% OFF" },
  { id: 2, name: "PREMIUM GIFT HAMPER", price: 1200, oldPrice: 1500, img: "/assets/enginnering.webp", discount: "20% OFF" },
  { id: 3, name: "A GIFT FOR MY BEST FRIEND", price: 1140, oldPrice: 1450, img: "/assets/fbesblw7qukemk1no2o5.webp", discount: "21% OFF" },
  { id: 4, name: "GOURMET WELLNESS DELIGHT", price: 950, oldPrice: 1200, img: "/assets/k2wtitnfsvysr7yuop8q.webp", discount: "20% OFF" },
  { id: 5, name: "THE PRODUCT IS FOR YOUR GIRL", price: 977, oldPrice: 1500, img: "/assets/k2wtitnfsvysr7yuop8q.webp", discount: "35% OFF" },
  { id: 6, name: "PREMIUM GIFT HAMPER", price: 1200, oldPrice: 1500, img: "/assets/enginnering.webp", discount: "20% OFF" },
  { id: 7, name: "A GIFT FOR MY BEST FRIEND", price: 1140, oldPrice: 1450, img: "/assets/fbesblw7qukemk1no2o5.webp", discount: "21% OFF" },
  { id: 8, name: "GOURMET WELLNESS DELIGHT", price: 950, oldPrice: 1200, img: "/assets/k2wtitnfsvysr7yuop8q.webp", discount: "20% OFF" },
];

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;

  const productData = products.find((p) => p.id.toString() === id);

  if (!productData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  // Transform to match Product interface
  const product: Product = {
    id: productData.id.toString(),
    name: productData.name,
    price: productData.price,
    oldPrice: productData.oldPrice,
    image: productData.img,
    discount: productData.discount,
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <ProductDetails product={product} />
    </div>
  );
}
