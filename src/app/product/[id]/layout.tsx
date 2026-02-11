import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const { data } = await supabaseAdmin
    .from("products")
    .select("title, description, image, category, price")
    .eq("id", params.id)
    .maybeSingle();
  const name = data?.title || "Product";
  const desc = data?.description || "Premium product from Luxahamps";
  const image = data?.image || "/assets/mainlogo.cb44b92e.svg";
  return {
    title: name,
    description: desc,
    openGraph: {
      type: "website",
      title: name,
      description: desc,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: desc,
      images: [image],
    },
    alternates: {
      canonical: `https://luxahamps-ecommerce.vercel.app/product/${params.id}`,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
