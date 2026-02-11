import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, updated_at, slug");
  const base = "https://luxahamps-ecommerce.vercel.app";
  const urls = [
    { loc: `${base}/`, lastmod: new Date().toISOString() },
    { loc: `${base}/products`, lastmod: new Date().toISOString() },
  ];
  (products || []).forEach((p: any) => {
    const loc = p.slug ? `${base}/p/${p.slug}` : `${base}/product/${p.id}`;
    urls.push({ loc, lastmod: p.updated_at || new Date().toISOString() });
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("")}
</urlset>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
