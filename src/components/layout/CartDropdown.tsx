// File: src/components/CartDropdown.tsx (or wherever your component is located)

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
// 🛑 IMPORT THE CART CONTEXT
import { useCart } from '@/contexts/CartContext';
// 🛑 IMPORT TOAST FOR FEEDBACK
import { useToast } from '@/hooks/use-toast';


export function CartDropdown() {
  // 🛑 USE THE CART CONTEXT TO GET LIVE DATA AND FUNCTIONS
  const { cartItems, removeCartItem, isLoading } = useCart();
  const { toast } = useToast();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // 1. 🛑 NEW HELPER FUNCTION: Correctly constructs the image URL
  // NOTE: This must match the helper in src/pages/Cart.tsx
  const getImageUrl = (path: string | undefined): string => {
    if (!path) {
      return 'https://via.placeholder.com/150?text=No+Image';
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // ASSUMPTION: Your Flask server is serving static files from 'http://127.0.0.1:5000/static'
    return `https://beltrandsmarketbackend.onrender.com/static${path}`;
  };

  // 🛑 NEW HANDLER: Remove item directly from the dropdown
  const handleRemove = async (productId: string, name: string) => {
    // The product_id is what the removeCartItem function expects
    await removeCartItem(productId);
    toast({ title: "Item removed", description: `${name} has been removed from your cart.`, duration: 2000 });
  };


  if (isLoading) {
    return (
      <div className="w-80 p-8 text-center text-muted-foreground">
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="w-80 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-glass-border">
        <h3 className="font-semibold text-lg">Shopping Cart</h3>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="p-4 space-y-4">
            {cartItems.map((item) => (
              // Use item.product_id or item._id as the key, depending on your data structure
              // We'll use product_id as it's the unique product identifier
              <div key={item.product_id} className="flex gap-3">
                <img 
                  // 🛑 Use the correct image URL helper
                  src={getImageUrl(item.image)} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-[#ff902b]">{item.price.toLocaleString()} RWF</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  // 🛑 Call the remove handler with the product ID
                  onClick={() => handleRemove(item.product_id, item.name)} 
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-glass-border space-y-3">
            <div className="flex justify-between items-center font-semibold">
              <span>Total:</span>
              <span className="text-[#ff902b]">{total.toLocaleString()} RWF</span>
            </div>
            <Link to="/cart" className="block">
              <Button className="w-full" variant="glass-primary">
                View Cart & Checkout
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}