import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const cartItems = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 45000,
    quantity: 1,
    image: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 85000,
    quantity: 2,
    image: '/placeholder.svg'
  }
];

export function CartDropdown() {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
              <div key={item.id} className="flex gap-3">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-[#ff902b]">{item.price.toLocaleString()} RWF</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
