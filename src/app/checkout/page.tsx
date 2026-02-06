"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; 
import { formatPrice } from "@/lib/utils";
import { Loader2, CheckCircle2, ChevronLeft, CreditCard } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { user } = useAuthStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [lastOrder, setLastOrder] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newOrder = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user?._id,
      customer: formData,
      items: cart,
      total: getCartTotal(),
      status: "Pending" as const,
      date: new Date().toISOString(),
      paymentMethod: "Cash on Delivery",
    };

    addOrder(newOrder);
    setLastOrder(newOrder);
    clearCart();
    setLoading(false);
    setSuccess(true);
  };

  if (!isMounted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight">Order Placed!</h1>
          <p className="mb-8 text-balance text-muted-foreground">
            Thank you for your purchase, **{formData.name}**. We've sent a confirmation email to **{formData.email}**.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/products" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">Continue Shopping</Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-8 text-muted-foreground">Add some items to your cart before checking out.</p>
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
      <div className="mb-8">
        <Link href="/cart" className="mb-2 flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Checkout</h1>
      </div>
      
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Column: Shipping Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>
              
              <Card className="border-gray-300 shadow-sm">
                <CardContent className="grid gap-6 p-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" required placeholder="John Doe" value={formData.name} onChange={handleInputChange} className="h-11 border-gray-300 shadow-sm" />
                  </div>
                  
                  <div className="grid  grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 ">
                      <Label htmlFor="email">Email Address</Label>
                      <Input  id="email" name="email" type="email" required placeholder="john@example.com" value={formData.email} onChange={handleInputChange} className="h-11 border-gray-300 shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" required placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleInputChange} className="h-11 border-gray-300 shadow-sm" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" name="address" required placeholder="123 Main St, Apt 4B" value={formData.address} onChange={handleInputChange} className="h-11 border-gray-300 shadow-sm" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required placeholder="New York" value={formData.city} onChange={handleInputChange} className="h-11 border-gray-300 shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" name="postalCode" required placeholder="10001" value={formData.postalCode} onChange={handleInputChange} className="h-11 border-gray-300 shadow-sm" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              <Card className="border-primary bg-primary/5 shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay with cash upon delivery of your order.</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </form>
        </div>

        {/* Right Column: Order Summary (Sticky on Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-8">
            <Card className="overflow-hidden border-none bg-muted/50 shadow-lg">
              <CardHeader className="bg-muted/80">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6 max-h-[40vh] space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-background">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold line-clamp-1">{item.name}</span>
                          <span className="text-xs text-muted-foreground font-medium">Qty: {item.quantity}</span>
                          {item.isGift && (
                             <span className="text-[10px] text-pink-600 font-medium mt-0.5">Gift Bundle</span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-6">
                <Button 
                  className="w-full py-6 text-lg font-bold shadow-md bg-pink-500 hover:bg-pink-400 transition-all active:scale-[0.98]" 
                  size="lg" 
                  type="submit" 
                  form="checkout-form"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Order"
                  )}
                </Button>
              </CardFooter>
            </Card>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              By placing your order, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
