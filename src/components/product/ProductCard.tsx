// File: src/components/ProductCard.tsx
// FIX: Updated to use the useFavorites context hook for real-time wishlist state and actions.

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext'; 
import { useAuth } from '@/contexts/AuthContext'; 
import { useToast } from '@/hooks/use-toast'; 
// 🛑 NEW: Import the Favorites Context hook
import { useFavorites } from '@/contexts/FavoriteContext'; 

interface ProductCardProps {
  id: string;
  title: string;
  // 🎯 FIX: Changed price and originalPrice to potentially be number | undefined | null
  price: number | undefined | null; 
  originalPrice?: number | undefined | null;
  image: string;
  rating: number;
  reviewCount: number;
  // 🎯 FIX: Make the seller object itself nullable to match backend safety checks
  seller: { name: string; rating: number; } | undefined | null; 
  badge?: string;
  // 🛑 REMOVED: These props are now handled internally by useFavorites
  // isWishlisted?: boolean;
  // onToggleWishlist?: () => void;
  onChatWithSeller?: () => void;
}

// Helper component to render stars based on fractional rating (unchanged)
const StarRating = ({ rating, size = 'w-3 h-3' }: { rating: number, size?: string }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const isFilled = i < Math.round(rating); 
        return (
          <Star
            key={i}
            className={`${size} ${
              isFilled
                ? 'text-warning fill-warning' 
                : 'text-muted-foreground'
            }`}
          />
        );
      })}
    </div>
  );
};


export function ProductCard({
  id, title, price, originalPrice, image, rating, reviewCount, seller, badge, 
  // 🛑 REMOVED: isWishlisted and onToggleWishlist from destructuring
  onChatWithSeller,
}: ProductCardProps) {

  const { addToCart, isLoading: isCartLoading } = useCart();
  const { isLoggedIn } = useAuth(); 
  const { toast } = useToast(); 
  
  // 🛑 NEW: Use the Favorites Context to get status and action
  const { 
    toggleFavorite, 
    isProductFavorited,
    isLoading: isFavoriteLoading 
  } = useFavorites();
  
  // 🛑 NEW: Get the current favorited status from the context
  const isWishlisted = isProductFavorited(id);
  
  // Safely calculate discount only if both prices are valid numbers
  const safePrice = Number(price);
  const safeOriginalPrice = Number(originalPrice);
  const discount = (safePrice > 0 && safeOriginalPrice > safePrice) 
    ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100) 
    : 0;
  
  // 🛑 NEW: Handler for the Wishlist button
  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
        toast({
            title: "Login Required",
            description: "Please log in to save items to your wishlist.",
            variant: "destructive",
            duration: 3000,
        });
        return;
    }
    toggleFavorite(id);
  };
  
  // Handler for Add to Cart with login check (kept as is, but renamed loading variable)
  const handleAddToCart = () => {
      if (!isLoggedIn) {
          toast({
              title: "Login Required",
              description: "Please log in or create an account to add items to your cart.",
              variant: "destructive",
              duration: 3000,
          });
          return;
      }
      
      console.log(`[ProductCard] Attempting to add product ID: ${id}. Auth: ${isLoggedIn}`); 
      addToCart(id, 1);
  };


  return (
    <div className="product-card group">
      <div className="relative">
        
        <Link 
          to={`/product/${id}`}
          className="block group-hover:pointer-events-none" 
        > 
          <div className="aspect-square overflow-hidden rounded-t-lg">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </Link>
        
        {/* Black Overlay and Badges (unchanged) */}
        <div 
          className="absolute inset-0 rounded-t-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10"> 
          {badge && (
            <Badge className="badge-glass bg-primary/90 text-primary-foreground"> {badge} </Badge>
          )}
          {discount > 0 && (
            <Badge className="badge-glass bg-destructive/90 text-destructive-foreground"> -{discount}% </Badge>
          )}
        </div>

        {/* 💖 Wishlist Button 💖 */}
        <Button
          size="icon" 
          variant="glass" 
          // 🛑 USE NEW HANDLER
          onClick={handleToggleFavorite}
          // 🛑 DISABLE WHILE FAVORITE ACTION IS PENDING
          disabled={isFavoriteLoading}
          className={`absolute top-2 right-2 h-8 w-8 z-10 ${ 
            isWishlisted ? 'text-destructive' : 'text-black hover:text-destructive' 
          }`}
        >
          <Heart 
            className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} 
          />
        </Button>

        {/* Quick Actions */}
        <div 
            className="absolute inset-x-2 bottom-2 flex gap-2 transition-opacity duration-300 z-50" 
        > 
          <Button
            size="sm"
            variant="glass-primary"
            className="flex-1"
            onClick={handleAddToCart} 
            // 🛑 USE CART LOADING VARIABLE
            disabled={isCartLoading} 
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            {isCartLoading ? 'Adding...' : 'Add to Cart'} 
          </Button>
          <Button size="icon" variant="glass" onClick={onChatWithSeller} className="h-8 w-8">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product Info (UPDATED PRICE AND SELLER LOGIC) */}
      <div className="p-4 space-y-2">
        <Link to={`/product/${id}`}> 
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-1">
          <StarRating rating={rating} />
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          {/* FIX 1: Current Price Check */}
          <span className="font-bold text-lg text-primary">
            Rwf
            {/* Check if price is not null/undefined/0 before calling toFixed */}
            {price !== undefined && price !== null && price > 0
              ? price.toFixed(2) 
              : '0.00'}
          </span>
          
          {/* FIX 2: Original Price Check */}
          {originalPrice !== undefined && originalPrice !== null && originalPrice > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              Rwf{originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* 🎯 FINAL FIX: Check if seller object exists before accessing its properties */}
          <span>by {seller ? seller.name : 'Unknown Seller'}</span>
          
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-warning fill-warning" /> 
            {/* Check if seller exists before accessing rating */}
            <span>{seller ? seller.rating : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}