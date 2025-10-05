// File: src/pages/Favorites.tsx

import React, { useEffect, useCallback } from 'react';
// 🛑 FIX: Added Star icon to imports
import { Heart, ShoppingCart, MessageCircle, X, Star } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/contexts/FavoriteContext';  
import { useCart } from '@/contexts/CartContext'; 
import { Link } from 'react-router-dom';

// Helper component to render stars based on fractional rating
const StarRating = ({ rating, size = 'w-4 h-4' }: { rating: number, size?: string }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const isFilled = i < Math.round(rating); 
        return (
          <Star
            key={i}
            className={`${size} ${
              isFilled
                ? 'text-[#ff902b] fill-[#ff902b]' 
                : 'text-muted-foreground'
            }`}
          />
        );
      })}
    </div>
  );
};


export default function Favorites() {
  const { toast } = useToast();
  // Use live data and functions from context
  const { favorites, fetchFavorites, toggleFavorite, isLoading: isFavoritesLoading } = useFavorites();
  const { addToCart, isLoading: isCartLoading } = useCart();

  const isLoading = isFavoritesLoading || isCartLoading;

  // Fetch favorites when the component mounts
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // LIVE HANDLER: Removes item using the context
  const handleRemoveFavorite = useCallback(async (productId: string, name: string) => {
    // Calling toggleFavorite acts as a removal since it's already favorited
    await toggleFavorite(productId);
    toast({
      title: "Removed from favorites",
      description: `${name} has been removed from your wishlist.`,
      duration: 2000,
    });
  }, [toggleFavorite, toast]);


  // LIVE HANDLER: Adds item to cart using the context
  const handleAddToCart = useCallback(async (productId: string, name: string) => {
    // Adds a quantity of 1
    await addToCart(productId, 1);
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart.`,
      duration: 2000,
    });
  }, [addToCart, toast]);

  // HELPER FUNCTION: Correctly constructs the image URL
  const getImageUrl = (path: string | undefined): string => {
    if (!path) {
      return 'https://via.placeholder.com/150?text=No+Image';
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `https://beltrandsmarketbackend.onrender.com/static${path}`;
  };


  if (isFavoritesLoading && favorites.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <p>Loading your wishlist...</p>
      </div>
    );
  }

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
              <div key={product._id} className="glass-card group relative overflow-hidden smooth-transition hover:shadow-lg">
                <button
                  onClick={() => handleRemoveFavorite(product._id, product.name)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full glass-medium hover:bg-destructive/20 smooth-transition"
                  aria-label="Remove from favorites"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </button>

                <Link to={`/product/${product._id}`}>
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img 
                        src={getImageUrl(product.imageUrl1)} 
                        alt={product.name}
                        className="w-full h-full object-cover smooth-transition group-hover:scale-105"
                    />
                    </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary smooth-transition">{product.name}</h3>
                  </Link>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <StarRating rating={product.rating || 0} size="w-3 h-3"/> 
                    <span className="text-sm text-muted-foreground ml-1">({(product.rating || 0).toFixed(1)})</span>
                  </div>

                  <p className="text-xl font-bold text-[#ff902b] mb-3">
                    {product.price.toLocaleString()} RWF
                  </p>

                  {!product.stock || product.stock <= 0 ? (
                    <p className="text-sm text-destructive mb-3">Out of Stock</p>
                  ) : (
                    <p className="text-sm text-success mb-3">In Stock</p>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="glass-primary" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAddToCart(product._id, product.name)}
                      disabled={isLoading || !product.stock || product.stock <= 0}
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