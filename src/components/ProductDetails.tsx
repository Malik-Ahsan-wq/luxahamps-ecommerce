"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Heart, Share2, ChevronDown, ChevronUp, Truck, RotateCcw, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/store/useQuickViewStore";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductDetailsProps {
  product: Product;
  isModal?: boolean;
}

export default function ProductDetails({ product, isModal = false }: ProductDetailsProps) {
  // Mock data for additional fields not in the basic product object
  const images = [
    product.image,
    product.image, // Duplicating for gallery demo
    product.image,
    product.image,
  ];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>("shipping");
  const router = useRouter();
  const { addToCart } = useCartStore();

  const handleBuyNow = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      category: (product as any).category || "",
    });
    router.push("/checkout");
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const stockLeft = 20; // Mock stock
  const stockProgress = 20; // Percentage for the bar

  return (
    <div className={`grid grid-cols-1 gap-8 ${isModal ? 'lg:grid-cols-2' : 'md:grid-cols-2'} h-full`}>
      {/* Left Column: Images */}
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover object-center"
          />
          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute left-2 top-2 bg-pink-600 px-2 py-1 text-xs font-bold text-white">
              {product.discount}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 transition-all ${
                selectedImage === idx ? "border-black" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Details */}
      <div className={`flex flex-col ${isModal ? 'overflow-y-auto pr-2' : ''}`}>
        {/* Category */}
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          {product.category || "Women"}
        </div>

        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold uppercase text-gray-900 sm:text-3xl">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="mb-4 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="ml-2 text-sm text-gray-500">(12 Reviews)</span>
        </div>

        {/* Price */}
        <div className="mb-6 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <p className="mb-6 text-xs font-medium uppercase text-gray-500">Tax Included</p>

        {/* Stock Indicator */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase text-gray-900">
            Hurry, Only <span className="text-pink-600">{stockLeft}</span> hampers left in stock!
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-pink-600"
              style={{ width: `${stockProgress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8 flex flex-col gap-3">
          <AddToCartButton
            product={{
                id: product.id.toString(),
                name: product.name,
                price: product.price,
                image: product.image,
                category: (product as any).category || "",
            }}
            variant="outline"
            className="w-full rounded-none border-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white"
          />
          <button 
            onClick={handleBuyNow}
            className="w-full bg-black py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
          >
            Buy It Now
          </button>
        </div>

        {/* Accordions */}
        <div className="border-t border-gray-200">
          <AccordionItem
            id="shipping"
            title="Shipping Information"
            icon={<Truck className="h-4 w-4" />}
            isOpen={openAccordion === "shipping"}
            onToggle={() => toggleAccordion("shipping")}
          >
            <p>
              Free shipping on orders over ₹1000. We ship within 24-48 hours.
              Standard delivery takes 3-5 business days.
            </p>
          </AccordionItem>
          
          <AccordionItem
            id="returns"
            title="Returns & Exchange"
            icon={<RotateCcw className="h-4 w-4" />}
            isOpen={openAccordion === "returns"}
            onToggle={() => toggleAccordion("returns")}
          >
            <p>
              Easy returns within 7 days of delivery. Items must be unused and
              in original packaging.
            </p>
          </AccordionItem>
          
          <AccordionItem
            id="details"
            title="Product Details"
            icon={<Info className="h-4 w-4" />}
            isOpen={openAccordion === "details"}
            onToggle={() => toggleAccordion("details")}
          >
            <p>
              This premium hamper is curated with love and care. Contains assorted items
              perfect for gifting. 100% authentic products.
            </p>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Accordion
function AccordionItem({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-xs font-bold uppercase tracking-wide text-gray-900">
            {title}
          </span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm leading-relaxed text-gray-600">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
