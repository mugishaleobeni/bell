import React, { useState } from 'react';
import { Heart, ShoppingCart, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const initialFavorites = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 45000,
    image: '/placeholder.svg',
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 85000,
    image: '/placeholder.svg',
    rating: 4.8,
    inStock: true
  },
  {
    id: 3,
    name: 'Camera Lens 50mm',
    price: 120000,
    image: '/placeholder.svg',
    rating: 4.6,
    inStock: false
  },
  {
    id: 4,
    name: 'Gaming Laptop',
    price: 850000,
    image: '/placeholder.svg',
    rating: 4.9,
    inStock: true
  }
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const { toast } = useToast();

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(item => item.id !== id));
    toast({
      title: "Removed from favorites",
      description: "Product has been removed from your wishlist."
    });
  };

  const addToCart = (product: typeof initialFavorites[0]) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Heart className="w-8 h-8 text-[#ff902b]" />
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding products you love!</p>
            <Button variant="glass-primary" onClick={() => window.location.href = '/'}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="glass-card group relative overflow-hidden smooth-transition hover:shadow-lg">
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full glass-medium hover:bg-destructive/20 smooth-transition"
                  aria-label="Remove from favorites"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover smooth-transition group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i}
                        className={`text-sm ${i < Math.floor(product.rating) ? 'text-[#ff902b]' : 'text-muted-foreground'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">({product.rating})</span>
                  </div>

                  <p className="text-xl font-bold text-[#ff902b] mb-3">
                    {product.price.toLocaleString()} RWF
                  </p>

                  {!product.inStock && (
                    <p className="text-sm text-destructive mb-3">Out of Stock</p>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="glass-primary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="px-3"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
