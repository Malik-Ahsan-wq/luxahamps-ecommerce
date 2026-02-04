"use client";

import { useEffect,useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";



export default function CartSidebar() {
  const {
    isOpen,
    cart,
    closeCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
  } = useCartStore();

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle ESC key to close cart
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeCart]);

  // Prevent body scroll when cart is open
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
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl sm:max-w-lg md:max-w-xl lg:max-w-3xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Your Cart ({getCartItemsCount()})</h2>
                </div>
                <button
                  onClick={closeCart}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                    <div className="rounded-full bg-gray-100 p-6">
                      <ShoppingBag className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                      <p className="text-gray-500">Looks like you haven&apos;t added anything yet.</p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="mt-4 rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {cart.map((item) => (
                      <li key={item.id} className="flex gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover object-center"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                            {item.isGift ? (
                              <div className="mt-1 text-sm text-gray-500">
                                <p className="text-xs font-medium mb-1 text-pink-600">Gift Bundle includes:</p>
                                <ul className="list-disc pl-4 text-xs space-y-0.5 mb-2">
                                  {item.giftItems?.map((giftItem, idx) => (
                                    <li key={idx}>{giftItem.quantity}x {giftItem.product.name}</li>
                                  ))}
                                </ul>
                                {item.giftMessage && (
                                  <div className="text-xs bg-gray-50 p-1.5 rounded italic border border-gray-100">
                                    "{item.giftMessage.length > 50 ? item.giftMessage.substring(0, 50) + '...' : item.giftMessage}"
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price)} each</p>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center rounded-lg border border-gray-200">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-2 font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
                  <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                    <p>Subtotal</p>
                    <p>{formatPrice(getCartTotal())}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 mb-6">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        closeCart();
                        router.push("/checkout");
                      }}
                      className="flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
                    >
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                    <button
                      onClick={closeCart}
                      className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
