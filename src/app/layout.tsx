import type { Metadata } from "next";
import { Playfair_Display, Poppins } from 'next/font/google'
import "./globals.css";
import 'swiper/css';
import 'swiper/css/navigation';
import CartSidebar from "@/components/CartSidebar";
import QuickViewModal from "@/components/QuickViewModal";
import Navbar from "@/app/Navbar/page";
import Footer from "@/app/Footer/page";
import OrderRatingPrompt from "@/components/OrderRatingPrompt";
import MessageButton from "@/components/MessageButton";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://luxahamps-ecommerce.vercel.app"),
  title: {
    default: "Luxahamps Ecommerce",
    template: "%s | Luxahamps",
  },
  description: "Luxury hampers and curated gifts. Premium quality, fast delivery.",
  keywords: ["luxury hampers", "gift boxes", "premium gifts", "corporate gifting"],
  openGraph: {
    type: "website",
    url: "https://luxahamps-ecommerce.vercel.app",
    title: "Luxahamps Ecommerce",
    description: "Luxury hampers and curated gifts. Premium quality, fast delivery.",
    siteName: "Luxahamps",
    images: [{ url: "/assets/mainlogo.cb44b92e.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@luxahamps",
    title: "Luxahamps Ecommerce",
    description: "Luxury hampers and curated gifts. Premium quality, fast delivery.",
    images: ["/assets/mainlogo.cb44b92e.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://luxahamps-ecommerce.vercel.app",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
   icon :"/favicon.ico"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartSidebar />
        <QuickViewModal />
        <MessageButton />
        <OrderRatingPrompt />
      </body>
    </html>
  );
}
