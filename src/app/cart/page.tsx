"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Gift } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
  } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (cart.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-4">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-8 text-muted-foreground">Add some items to your cart before checking out.</p>
        <Link href="/products">
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-8">Shopping Cart</h1>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 border rounded-lg shadow-sm bg-white">
                {/* Image */}
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>

                    {item.isGift ? (
                      <div className="mt-3 bg-pink-50 p-3 rounded-md border border-pink-100">
                        <p className="text-xs font-bold text-pink-600 mb-2 flex items-center gap-1">
                          <Gift className="w-3 h-3" /> Gift Bundle Includes:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.giftItems?.map((giftItem, idx) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                              <span className="font-medium">{giftItem.quantity}x</span> {giftItem.product.name}
                            </li>
                          ))}
                        </ul>
                        {(item.giftMessage || item.recipientName) && (
                          <div className="mt-3 pt-2 border-t border-pink-100 text-xs text-gray-600">
                             {item.recipientName && <p className="mb-1">For: <span className="font-medium">{item.recipientName}</span></p>}
                             {item.giftMessage && (
                               <p className="italic">"{item.giftMessage}"</p>
                             )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price)} each</p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 text-gray-600"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 text-gray-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 text-sm transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-lg border bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-base text-gray-600">
                <p>Subtotal ({getCartItemsCount()} items)</p>
                <p className="font-medium text-gray-900">{formatPrice(getCartTotal())}</p>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <p>Shipping</p>
                <p className="text-green-600 font-medium">Free</p>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <p>Total</p>
                <p>{formatPrice(getCartTotal())}</p>
              </div>
            </div>

            <Link href="/checkout" className="w-full mt-8 block">
              <Button className="w-full bg-black hover:bg-gray-800 text-white" size="lg">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/products" className="w-full mt-4 block text-center">
              <span className="text-sm text-gray-500 hover:text-gray-900 hover:underline cursor-pointer">
                Continue Shopping
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
