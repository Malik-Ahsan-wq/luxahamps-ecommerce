"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Heart, Share2, ChevronDown, ChevronUp, Truck, RotateCcw, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/store/useQuickViewStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";
import ProductRatingSection from "@/components/ProductRatingSection";
import ProductReviews from "@/components/ProductReviews";

interface ProductDetailsProps {
  product: Product;
  isModal?: boolean;
}

export default function ProductDetails({ product, isModal = false }: ProductDetailsProps) {
  const [gallery, setGallery] = useState<string[]>([product.image]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>("shipping");
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id.toString());

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id.toString());
    } else {
      addToWishlist({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch(`/api/products`, { cache: 'no-store' })
        if (res.ok) {
          const products = await res.json()
          const currentProduct = products.find((p: any) => p.id === product.id || p.id.toString() === product.id)
          console.log('Found product:', currentProduct)
          console.log('Gallery images:', currentProduct?.galleryImages)
          if (active && currentProduct) {
            const galleryUrls = Array.isArray(currentProduct.galleryImages) ? currentProduct.galleryImages : []
            console.log('Processed gallery URLs:', galleryUrls)
            if (galleryUrls.length > 0) {
              const allImages = [product.image, ...galleryUrls]
              console.log('Setting gallery with all images:', allImages)
              setGallery(allImages)
              setSelectedIndex(0)
            } else {
              console.log('No gallery images, using main image only')
              setGallery([product.image])
            }
          } else if (active) {
            setGallery([product.image])
          }
        } else {
          if (active) setGallery([product.image])
        }
      } catch (error) {
        console.error('Error loading gallery:', error)
        if (active) setGallery([product.image])
      }
    })()
    return () => { active = false }
  }, [product.id, product.image])

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

  const stockLeft = product.stock || 0
  const stockProgress = Math.min((stockLeft / 50) * 100, 100) // Progress based on max 50 items

  return (
    <div className={`grid grid-cols-1 gap-8 ${isModal ? 'lg:grid-cols-2' : 'md:grid-cols-2'} h-full`}>
      {/* Left Column: Images */}
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={gallery[selectedIndex] || product.image}
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
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 transition-all ${
                selectedIndex === idx ? "border-black" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image src={img} alt={`View ${idx + 1}`} fill sizes="80px" className="object-cover" />
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

        <div className="mb-4">
          <ProductRatingSection productId={product.id.toString()} />
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
          {stockLeft > 0 ? (
            <>
              <p className="mb-2 text-xs font-bold uppercase text-gray-900">
                In Stock: <span className="text-green-600">{stockLeft}</span> items available
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  style={{ width: `${stockProgress}%` }}
                />
              </div>
            </>
          ) : (
            <p className="mb-2 text-xs font-bold uppercase text-red-600">
              Out of Stock
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex gap-3">
            <AddToCartButton
              product={{
                  id: product.id.toString(),
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: (product as any).category || "",
              }}
              variant="outline"
              className="flex-1 rounded-none border-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white"
              disabled={stockLeft === 0}
            />
            <button
              onClick={handleWishlistToggle}
              className={`px-4 py-4 border-2 transition-colors ${
                inWishlist 
                  ? 'border-pink-600 bg-pink-50 text-pink-600' 
                  : 'border-black hover:bg-black hover:text-white'
              }`}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className="w-5 h-5" fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
          <button 
            onClick={handleBuyNow}
            disabled={stockLeft === 0}
            className="w-full bg-black py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {stockLeft > 0 ? 'Buy It Now' : 'Out of Stock'}
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
        <div className="mt-8">
          <ProductReviews productId={product.id.toString()} />
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
