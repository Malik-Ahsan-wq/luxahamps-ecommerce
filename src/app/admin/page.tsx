 "use client";
 
 import React, { useEffect, useState } from "react";
 import { useRouter } from "next/navigation";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Label } from "@/components/ui/label";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 
 export default function AdminPage() {
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
 
   const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").trim();
   const ADMIN_PASSWORD = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "").trim();
 
   useEffect(() => {
     try {
       const session = typeof window !== "undefined" ? localStorage.getItem("admin_session") : null;
       if (session) {
         router.replace("/admin/dashboard");
       }
     } catch {}
   }, [router]);
 
   const onSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError(null);
     setLoading(true);
     try {
       const ok =
         email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() &&
         password.trim() === ADMIN_PASSWORD;
       if (!ok) {
         setError("Access Denied");
         return;
       }
       const payload = JSON.stringify({ email: ADMIN_EMAIL, ts: Date.now() });
       localStorage.setItem("admin_session", payload);
       router.replace("/admin/dashboard");
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="container mx-auto px-4 py-12 max-w-md">
       <Card>
         <CardHeader>
           <CardTitle>Admin Login</CardTitle>
         </CardHeader>
         <CardContent>
           <form onSubmit={onSubmit} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="admin-email">Email</Label>
               <Input
                 id="admin-email"
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 placeholder="admin@example.com"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="admin-password">Password</Label>
               <Input
                 id="admin-password"
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 placeholder="••••••••"
               />
             </div>
             {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
             <Button type="submit" disabled={loading} className="w-full">
               {loading ? "Signing in..." : "Sign In"}
             </Button>
           </form>
         </CardContent>
       </Card>
     </div>
   );
 }
