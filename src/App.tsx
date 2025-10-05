// File: src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext"; 

// 🛑 EXISTING IMPORT
import { CartProvider } from "@/contexts/CartContext"; 
// 🌟 NEW IMPORT: Import the FavoriteProvider 🌟
import { FavoriteProvider } from "@/contexts/FavoriteContext"; 

// 🚀 Dynamic Imports (Code Splitting)
import React, { lazy, Suspense } from 'react'; 

// ⚠️ Standard Static Imports (Keep only critical components)
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatBot } from "@/components/layout/ChatBot";
import Homepage from "./pages/Homepage"; 
import NotFound from "./pages/NotFound"; 
import ProfileSettings from "./pages/ProfileSettings";
import ProductDetailPage from "./pages/ProductDetailPage";

// 🚀 Dynamic Imports (Code Splitting)
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SellPage = lazy(() => import("./pages/SellPage"));
// NOTE: Ensure this path is correct, should be './pages/Favorites' if file is named Favorites.tsx
const Favorites = lazy(() => import("./pages/FavouritePage")); 
const OrderPage = lazy(() => import("./pages/OrderPage"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ChatPage = lazy(() => 
  import("./pages/ChatPage").then(module => ({ default: module.ChatPage }))
);


const queryClient = new QueryClient();

// The main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        {/* 🌟 CRITICAL FIX: Nest the FavoriteProvider here 🌟 */}
        <FavoriteProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                {/* WRAP THE ENTIRE ROUTE STRUCTURE WITH SUSPENSE */}
                <Suspense fallback={<div className="p-8 text-center text-lg">Loading Application...</div>}>
                  <Routes>
                    {/* Auth Routes without Navbar */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Main Routes with Navbar */}
                    <Route path="*" element={
                      <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                          <Routes>
                            <Route path="/" element={<Homepage />} />
                            
                            {/* All dynamically loaded pages */}
                            <Route path="/sell" element={<SellPage/>} />
                            <Route path="/wishlist" element={<Favorites/>} />
                            <Route path="/orders" element={<OrderPage/>} />
                            <Route path="/messages" element={<ChatPage/>} /> 
                            <Route path="/cart" element={<Cart/>}/>
                            <Route path="/checkout" element={<Checkout/>}/>
                            <Route path="/profile/settings" element={<ProfileSettings/>} />
                            <Route path="/product/:productId" element={<ProductDetailPage />} />

                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                        <Footer />
                        <ChatBot />
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </FavoriteProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;