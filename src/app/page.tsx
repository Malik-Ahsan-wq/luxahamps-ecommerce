import Image from "next/image";
import HeroSection from "./HeroSection/page";
import GiftSlider from "./GiftSection/page";
import OurPromise from "./PromiseSection/page";
import ProductSection from "./ProductSection/page";
import HappinessSection from "./HappinessSection/page";
import ValentineSection from "./ValentineSection/page";
import BrandSlider from "./BrandSlider/page";
import VoicePage from "./VoiceSection/page";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
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
