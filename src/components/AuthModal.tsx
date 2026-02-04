"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { LogOut, Package, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, logout, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    login(email);
    setLoading(false);
    onClose();
    // Reset form
    setEmail("");
    setPassword("");
    setName("");
    
    // If admin email (for demo), redirect to admin
    if (email.includes("admin")) {
        router.push("/admin");
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    // Clear errors or reset fields if needed
  };

  if (isAuthenticated && user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">My Account</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="h-20 w-20 rounded-full bg-pink-50 border-2 border-pink-100 flex items-center justify-center">
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                    <span className="text-3xl font-bold text-pink-600">
                        {user.name.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="font-bold text-xl">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium uppercase tracking-wider text-gray-600">
                {user.role}
              </span>
            </div>

            <div className="w-full space-y-3">
                {user.role === 'admin' && (
                    <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => {
                            router.push('/admin');
                            onClose();
                        }}
                    >
                        <User className="mr-2 h-4 w-4" /> Admin Dashboard
                    </Button>
                )}
                
                <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => {
                        router.push('/orders');
                        onClose();
                    }}
                >
                    <Package className="mr-2 h-4 w-4" /> My Orders
                </Button>

                <Button 
                    variant="destructive" 
                    className="w-full justify-start" 
                    onClick={() => {
                        logout();
                        onClose();
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "login" 
              ? "Enter your credentials to access your account" 
              : "Enter your details to create a new account"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={loading}>
            {loading ? "Processing..." : (mode === "login" ? "Sign In" : "Sign Up")}
          </Button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-pink-600 hover:underline"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
