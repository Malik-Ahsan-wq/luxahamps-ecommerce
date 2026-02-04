"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useQuickViewStore } from "@/store/useQuickViewStore";
import ProductDetails from "./ProductDetails";

export default function QuickViewModal() {
  const { isOpen, selectedProduct, closeQuickView } = useQuickViewStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeQuickView]);

  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-sm bg-white shadow-2xl"
            style={{ maxHeight: "90vh" }}
          >
            {/* Close Button */}
            <button
              onClick={closeQuickView}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 hover:bg-black hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Content Scrollable Area */}
            <div className="h-full overflow-y-auto p-6 md:p-10" style={{ maxHeight: "90vh" }}>
              <ProductDetails product={selectedProduct} isModal={true} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
