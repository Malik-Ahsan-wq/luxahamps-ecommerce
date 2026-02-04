"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore, Product } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus, X, Gift, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function GiftBuilderPage() {
  const router = useRouter();
  const { products } = useProductStore();
  const { addToCart, openCart } = useCartStore();

  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [giftMessage, setGiftMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Helper to get product details
  const getProduct = (id: string) => products.find((p) => p.id === id);

  // Calculate totals
  const selectedProductsList = Object.entries(selectedItems).map(([id, qty]) => {
    const product = getProduct(id);
    return { product, quantity: qty };
  }).filter((item) => item.product);

  const totalItems = Object.values(selectedItems).reduce((a, b) => a + b, 0);
  const totalPrice = selectedProductsList.reduce((sum, item) => {
    return sum + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  const handleQuantityChange = (productId: string, delta: number) => {
    setSelectedItems((prev) => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const newItems = { ...prev };
      if (newQty === 0) {
        delete newItems[productId];
      } else {
        newItems[productId] = newQty;
      }
      return newItems;
    });
  };

  const handleConfirmGift = () => {
    if (totalItems === 0) return;

    // Create the bundle product
    const bundleId = `gift-${Date.now()}`;
    const giftBundle: Product = {
      id: bundleId,
      name: "Custom Gift Box",
      price: totalPrice,
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60", // Generic gift box image
      isGift: true,
      giftItems: selectedProductsList.map(item => ({
        product: item.product as Product,
        quantity: item.quantity
      })),
      giftMessage,
      recipientName,
      occasion
    };

    addToCart(giftBundle);
    setShowPreview(false);
    openCart();
    // Optional: Redirect to products or stay here? Flow says "After confirmation... Entire gift bundle is added to cart... Cart page shows"
    // Since we opened the cart sidebar, the user can see it.
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gift className="text-pink-600" /> Build Your Custom Gift
          </h1>
          <p className="text-muted-foreground mt-2">
            Select products, add a personal message, and create the perfect gift.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Left: Product Selection */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const quantity = selectedItems[product.id] || 0;
              return (
                <Card key={product.id} className={`overflow-hidden transition-all ${quantity > 0 ? 'ring-2 ring-pink-500' : ''}`}>
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    {quantity > 0 && (
                      <div className="absolute top-2 right-2 bg-pink-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md">
                        {quantity}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{formatPrice(product.price)}</span>
                      
                      {quantity === 0 ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleQuantityChange(product.id, 1)}
                          className="bg-black hover:bg-gray-800"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 bg-gray-100 rounded-md p-1">
                          <button 
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded bg-white shadow-sm hover:bg-gray-50 text-gray-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center font-medium text-sm">{quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded bg-white shadow-sm hover:bg-gray-50 text-gray-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Summary Panel (Sticky) */}
        <div className="lg:w-96 shrink-0">
          <div className="sticky top-24 space-y-6">
            <Card className="shadow-lg border-t-4 border-t-pink-500">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Gift Summary</span>
                  <span className="text-sm font-normal text-muted-foreground">{totalItems} items</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Items List */}
                {selectedProductsList.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                    {selectedProductsList.map(({ product, quantity }) => (
                      <div key={product?.id} className="flex justify-between items-start text-sm">
                        <div className="flex gap-2">
                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                            <img src={product?.image} alt={product?.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">{product?.name}</p>
                            <p className="text-muted-foreground">Qty: {quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {product ? formatPrice(product.price * quantity) : 0}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg bg-gray-50">
                    <Gift className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select products to start building your gift box</p>
                  </div>
                )}

                <Separator />

                {/* Gift Details Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Name (Optional)</Label>
                    <Input 
                      id="recipient" 
                      placeholder="e.g. Alice" 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="occasion">Occasion (Optional)</Label>
                    <Input 
                      id="occasion" 
                      placeholder="e.g. Birthday" 
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="message">Gift Message</Label>
                      <span className="text-xs text-muted-foreground">{giftMessage.length}/200</span>
                    </div>
                    <Textarea 
                      id="message" 
                      placeholder="Write a personal note..." 
                      value={giftMessage}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGiftMessage(e.target.value.slice(0, 200))}
                      className="resize-none h-24"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Price</span>
                  <span className="text-pink-600">{formatPrice(totalPrice)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-700" 
                  size="lg"
                  disabled={totalItems === 0}
                  onClick={() => setShowPreview(true)}
                >
                  Review Gift Bundle <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Gift</DialogTitle>
            <DialogDescription>
              Please review your gift box details before adding to cart.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-gray-50 p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Gift className="w-4 h-4 text-pink-500" /> Gift Box Contents
              </h4>
              <ul className="space-y-2 text-sm">
                {selectedProductsList.map(({ product, quantity }) => (
                  <li key={product?.id} className="flex justify-between">
                    <span>{quantity}x {product?.name}</span>
                    <span className="text-muted-foreground">{product ? formatPrice(product.price * quantity) : 0}</span>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total Value</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {(recipientName || occasion || giftMessage) && (
              <div className="rounded-lg border p-4 space-y-2">
                {recipientName && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">To: </span>
                    <span className="font-medium">{recipientName}</span>
                  </div>
                )}
                {occasion && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Occasion: </span>
                    <span className="font-medium">{occasion}</span>
                  </div>
                )}
                {giftMessage && (
                  <div className="mt-2 bg-pink-50 p-3 rounded text-sm italic text-gray-700 relative">
                    <span className="absolute top-[-8px] left-4 text-2xl text-pink-200">"</span>
                    {giftMessage}
                    <span className="absolute bottom-[-14px] right-4 text-2xl text-pink-200">"</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>Edit Gift</Button>
            <Button onClick={handleConfirmGift} className="bg-pink-600 hover:bg-pink-700">
              <Check className="mr-2 w-4 h-4" /> Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
