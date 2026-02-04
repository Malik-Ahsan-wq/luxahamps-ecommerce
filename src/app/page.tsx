import Image from "next/image";
import Navbar from "./Navbar/page";
import HeroSection from "./HeroSection/page";
import GiftSlider from "./GiftSection/page";
import OurPromise from "./PromiseSection/page";
import ProductSection from "./ProductSection/page";
import HappinessSection from "./HappinessSection/page";
import ValentineSection from "./ValentineSection/page";
import VoicePage from "./VoiceSection/page";
import Footer from "./Footer/page";
export default function Home() {
  return (
    <>
    <div className="max-w-7xl mx-auto">
<Navbar />
<HeroSection/>
<GiftSlider/>
<OurPromise/>
<ProductSection/>  
<HappinessSection/>
<ValentineSection/>
<VoicePage/>
<Footer/>
    <h1>hello thi is home page</h1>
    </div>
    </>

  );
}
