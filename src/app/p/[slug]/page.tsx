"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductDetails from "@/components/ProductDetails";
import { JsonLd } from "@/components/JsonLd";

export default function ProductSlugPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("products")
        .select("id, title, description, image, category, price, stock, slug")
        .eq("slug", slug)
        .maybeSingle();
      const p = data || null;
      if (p) {
        setProduct({
          id: String(p.id),
          name: p.title,
          price: Number(p.price) || 0,
          image: p.image || "",
          category: p.category || "",
          description: p.description || "",
          oldPrice: Math.round((Number(p.price) || 0) * 1.25),
          discount: "25% OFF",
          stock: Number(p.stock || 0),
        });
      }
    })();
  }, [slug]);

  if (!product) return null;

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
          "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": `https://luxahamps-ecommerce.vercel.app/p/${slug}`
        }
      }} />
      <ProductDetails product={product} />
    </div>
  );
}
