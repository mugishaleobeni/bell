import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  seller: {
    name: string;
    rating: number;
  };
  badge?: string;
  isWishlisted?: boolean;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  onChatWithSeller?: () => void;
}

// Helper component to render stars based on fractional rating
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
  id,
  title,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  seller,
  badge,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
  onChatWithSeller,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="product-card group">
      <div className="relative">
        {/* Product Image Link Container */}
        <Link to={`/product/${id}`}> 
          <div className="aspect-square overflow-hidden rounded-t-lg">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </Link>
        
        {/* Black Overlay on Hover */}
        <div 
          className="absolute inset-0 rounded-t-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10"> 
          {badge && (
            <Badge className="badge-glass bg-primary/90 text-primary-foreground">
              {badge}
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="badge-glass bg-destructive/90 text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* -------------------------------------- */}
        {/* UPDATED: Wishlist Button for visibility and color */}
        {/* -------------------------------------- */}
        <Button
          size="icon"
          variant="glass"
          className={`absolute top-2 right-2 h-8 w-8 z-10 ${ 
            isWishlisted 
              ? 'text-destructive' // Red color when wishlisted
              : 'text-black hover:text-destructive' // Black color by default, red on hover
          }`}
          onClick={onToggleWishlist}
        >
          {/* Note: The heart is always visible now. 
               We fill it when it is wishlisted (red), and keep it unfilled (black outline) otherwise. */}
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>

        {/* Quick Actions - Show on Hover */}
        <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"> 
          <Button
            size="sm"
            variant="glass-primary"
            className="flex-1"
            onClick={onAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
          <Button
            size="icon"
            variant="glass"
            className="h-8 w-8"
            onClick={onChatWithSeller}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <Link to={`/product/${id}`}> 
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Rating - Using the new StarRating component */}
        <div className="flex items-center gap-1">
          <StarRating rating={rating} />
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-primary">
            Rwf{price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              Rwf{originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Seller */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>by {seller.name}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-warning fill-warning" /> 
            <span>{seller.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}