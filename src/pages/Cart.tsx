import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const initialCartItems = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 45000,
    quantity: 1,
    image: '/placeholder.svg',
    seller: 'Audio Tech Store'
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 85000,
    quantity: 2,
    image: '/placeholder.svg',
    seller: 'Gadget Hub'
  },
  {
    id: 3,
    name: 'Camera Lens 50mm',
    price: 120000,
    quantity: 1,
    image: '/placeholder.svg',
    seller: 'Camera World'
  }
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const { toast } = useToast();

  const updateQuantity = (id: number, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Product has been removed from your cart."
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-[#ff902b]" />
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add products to get started!</p>
            <Button variant="glass-primary" onClick={() => window.location.href = '/'}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="glass-card p-4 flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Sold by {item.seller}</p>
                    <p className="text-lg font-bold text-[#ff902b]">
                      {item.price.toLocaleString()} RWF
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/20"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2 glass-medium rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">{shipping.toLocaleString()} RWF</span>
                  </div>
                  <div className="border-t border-glass-border pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-xl font-bold text-[#ff902b]">
                        {total.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button variant="glass-primary" className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link to="/">
                  <Button variant="outline" className="w-full mt-3">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
