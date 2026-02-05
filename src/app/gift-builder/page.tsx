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
import { Plus, Minus, X, Gift, ShoppingBag, ArrowRight, Check, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function GiftBuilderPage() {
  const router = useRouter();
  const { products } = useProductStore();
  const { addToCart, openCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [giftMessage, setGiftMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Mock box options (you can replace with real data)
  const boxOptions = [
    {
      id: "box-1",
      name: "Classic White Box",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60",
      discount: "10%",
      isNew: true
    },
    {
      id: "box-2",
      name: "Premium Blue Box",
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&auto=format&fit=crop&q=60",
      discount: "10%",
      isNew: true
    },
    {
      id: "box-3",
      name: "Elegant Gold Box",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60",
      discount: "10%",
      isNew: true
    },
    {
      id: "box-4",
      name: "Natural Kraft Box",
      image: "https://images.unsplash.com/photo-1606914469633-84f550455f8f?w=500&auto=format&fit=crop&q=60",
      discount: "10%",
      isNew: true
    }
  ];

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
    const selectedBoxData = boxOptions.find(box => box.id === selectedBox);
    
    const giftBundle: Product = {
      id: bundleId,
      name: "Custom Gift Box",
      price: totalPrice,
      image: selectedBoxData?.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60",
      isGift: true,
      giftItems: selectedProductsList.map(item => ({
        product: item.product as Product,
        quantity: item.quantity,
      })),
      giftMessage,
      recipientName,
      occasion,
      category: "Gift Box"

    };

    addToCart(giftBundle);
    setShowPreview(false);
    openCart();
  };

  const steps = [
    { number: 1, label: "Choose Box", sublabel: "Choose Box" },
    { number: 2, label: "Choose Products", sublabel: "Choose Products" },
    { number: 3, label: "Greeting Cards", sublabel: "Greeting Cards" },
    { number: 4, label: "Custom Msg", sublabel: "Custom Msg" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Steps */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
              <div 
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all ${
                  currentStep >= step.number 
                    ? 'bg-black text-white' 
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}>
                  {step.number}
                </div>
                <div className="text-center">
                  <div className={`text-xs font-semibold ${
                    currentStep >= step.number ? 'text-black' : 'text-gray-400'
                  }`}>
                    STEP {step.number}
                  </div>
                  <div className={`text-xs ${
                    currentStep >= step.number ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {step.sublabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 1: Choose Box */}
      {currentStep === 1 && (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">CHOOSE THE BOX</h1>
            <p className="text-gray-600">Choose your gift packaging, then begin selecting items to fill your box.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {boxOptions.map((box) => (
              <div key={box.id} className="group relative">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    <span className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded">
                      {box.discount}
                    </span>
                    {box.isNew && (
                      <span className="bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded">
                        New
                      </span>
                    )}
                  </div>

                  {/* Quick View Icon */}
                  <button className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <Search className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Image */}
                  <img 
                    src={box.image} 
                    alt={box.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Select Button */}
                <button
                  onClick={() => {
                    setSelectedBox(box.id);
                    setCurrentStep(2);
                  }}
                  className="w-full mt-3 bg-black text-white py-3 font-semibold hover:bg-gray-800 transition-colors"
                >
                  SELECT
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="text-xl font-bold">
                TOTAL: ₹0
              </div>
              <Button 
                size="lg"
                className="bg-gray-400 hover:bg-gray-500 text-white"
                disabled
              >
                Next <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Choose Products */}
      {currentStep === 2 && (
        <div className="container mx-auto px-4 py-12 pb-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">CHOOSE PRODUCTS</h1>
            <p className="text-gray-600">Select the perfect items for your gift box</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

          {/* Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="text-xl font-bold">
                TOTAL: {formatPrice(totalPrice)}
              </div>
              <Button 
                size="lg"
                className={totalItems > 0 ? "bg-gray-700 hover:bg-gray-800 text-white" : "bg-gray-400 text-white"}
                disabled={totalItems === 0}
                onClick={() => setCurrentStep(3)}
              >
                Next <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Greeting Cards */}
      {currentStep === 3 && (
        <div className="container mx-auto px-4 py-12 pb-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">GREETING CARDS</h1>
            <p className="text-gray-600">Choose a greeting card for your gift (optional)</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Name (Optional)</Label>
                <Input 
                  id="recipient" 
                  placeholder="e.g. Alice" 
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion (Optional)</Label>
                <Input 
                  id="occasion" 
                  placeholder="e.g. Birthday" 
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed">
              <p className="text-center text-gray-500 mb-4">Greeting card preview will appear here</p>
              <div className="text-center">
                <Button variant="outline">Choose Card Template</Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="text-xl font-bold">
                TOTAL: {formatPrice(totalPrice)}
              </div>
              <div className="flex gap-3">
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </Button>
                <Button 
                  size="lg"
                  className="bg-gray-700 hover:bg-gray-800 text-white"
                  onClick={() => setCurrentStep(4)}
                >
                  Next <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Custom Message */}
      {currentStep === 4 && (
        <div className="container mx-auto px-4 py-12 pb-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">CUSTOM MESSAGE</h1>
            <p className="text-gray-600">Add a personal touch to your gift</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Gift Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Items List */}
                {selectedProductsList.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Selected Items:</h4>
                    {selectedProductsList.map(({ product, quantity }) => (
                      <div key={product?.id} className="flex justify-between items-center text-sm border-b pb-2">
                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                            <img src={product?.image} alt={product?.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium">{product?.name}</p>
                            <p className="text-muted-foreground">Qty: {quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {product ? formatPrice(product.price * quantity) : 0}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
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
                      className="resize-none h-32"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Price</span>
                  <span className="text-pink-600">{formatPrice(totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="text-xl font-bold">
                TOTAL: {formatPrice(totalPrice)}
              </div>
              <div className="flex gap-3">
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                >
                  Back
                </Button>
                <Button 
                  size="lg"
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={() => setShowPreview(true)}
                >
                  Review & Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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