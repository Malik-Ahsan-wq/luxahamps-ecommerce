import Image from "next/image";
import dynamic from "next/dynamic";
import HeroSection from "./HeroSection/page";
import GiftSlider from "./GiftSection/page";
import OurPromise from "./PromiseSection/page";
import ProductSection from "./ProductSection/page";
import HappinessSection from "./HappinessSection/page";
import ValentineSection from "./ValentineSection/page";
import { JsonLd } from "@/components/JsonLd";
const BrandSlider = dynamic(() => import("./BrandSlider/page"));
const VoicePage = dynamic(() => import("./VoiceSection/page"));

export default function Home() {
  return (
    <div className="w-full bg-white">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Luxahamps Ecommerce",
        "url": "https://luxahamps-ecommerce.vercel.app",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://luxahamps-ecommerce.vercel.app/products?search={query}",
          "query-input": "required name=query"
        }
      }} />
      <HeroSection/>
      <GiftSlider/>
      <OurPromise/>
      <ProductSection/>  
      <HappinessSection/>
      <ValentineSection/>
      <VoicePage/>
      <BrandSlider/>
    </div>
  );
}
