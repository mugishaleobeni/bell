// File: src/contexts/FavoriteContext.tsx

import React, { 
    createContext, 
    useContext, 
    useState, 
    useCallback, 
    ReactNode 
} from 'react';
import api from '@/utils/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define the shape of a favorited product (Updated with necessary fields for rendering)
interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  imageUrl1?: string;       // For displaying image
  stock?: number;  // For checking stock status
  rating?: number;          // For displaying rating
  // Add other relevant product fields as needed (e.g., description, seller info)
}

// 🌟 NEW INTERFACE: Defines the structure of a recommended product (must match backend output)
interface RecommendedProduct extends FavoriteProduct {
    reviewCount?: number;
    seller?: { name: string; rating: number };
}


// Define the shape of the context state and functions
interface FavoriteContextType {
  favorites: FavoriteProduct[];
  favoriteIds: string[];
  isLoading: boolean;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<boolean | undefined>;
  isProductFavorited: (productId: string) => boolean;
  // 🌟 NEW CONTEXT VALUES
  recommendedProducts: RecommendedProduct[];
  isRecommendationsLoading: boolean;
  fetchRecommendations: () => Promise<void>;
}

// Create the context
const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

interface FavoriteProviderProps {
  children: ReactNode;
}

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🌟 NEW STATE for Recommendations, initialized to [] to prevent .map() error
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  // Memoized function to fetch the user's full list of favorites
  const fetchFavorites = useCallback(async () => {
    if (!isLoggedIn) {
      setFavorites([]);
      setFavoriteIds([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get('/api/favorites/');
      const items: FavoriteProduct[] = response.data.products || [];
      
      setFavorites(items);
      // Extract only the IDs for fast lookup in components
      setFavoriteIds(items.map(item => item._id));
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      toast({
          title: "Error",
          description: "Failed to load your wishlist.",
          variant: "destructive",
      });
      setFavorites([]);
      setFavoriteIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, toast]);

  // Function to add or remove a product from the favorites list
  const toggleFavorite = useCallback(async (productId: string): Promise<boolean | undefined> => {
    if (!isLoggedIn) {
        toast({
            title: "Login Required",
            description: "Please log in to save items to your wishlist.",
            variant: "destructive",
        });
        return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post(`/api/favorites/toggle/${productId}`);
      const isNowFavorited = response.status === 201; // 201 = Added, 200 = Removed

      // Always re-fetch the complete list for guaranteed accuracy
      await fetchFavorites();
      
      // 💡 Bonus: Re-fetch recommendations if an item was added/removed (user preference changed)
      await fetchRecommendations(); 

      toast({
          title: isNowFavorited ? "Item Favorited" : "Item Unfavorited",
          description: response.data.msg, // Use the message from the backend
          variant: isNowFavorited ? "default" : "default", 
      });
      return isNowFavorited;

    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast({
          title: "Error",
          description: "Could not update your wishlist.",
          variant: "destructive",
      });
      return undefined; // Return undefined on failure
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, fetchFavorites, toast]); // Added fetchRecommendations to dependencies

  // Fast check function for ProductCard
  const isProductFavorited = useCallback((productId: string) => {
    return favoriteIds.includes(productId);
  }, [favoriteIds]);

  // 🌟 NEW FUNCTION: Fetch product recommendations based on favorites
  const fetchRecommendations = useCallback(async () => {
    if (!isLoggedIn) {
      setRecommendedProducts([]);
      return;
    }

    setIsRecommendationsLoading(true);
    try {
      // 🛑 Using the new dedicated endpoint
      const response = await api.get('/api/recommendproduct'); 
      const items: RecommendedProduct[] = response.data.products || [];
      
      setRecommendedProducts(items);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      // Handle error display if needed
    } finally {
      setIsRecommendationsLoading(false);
    }
  }, [isLoggedIn]);


  return (
    <FavoriteContext.Provider value={{
      favorites,
      favoriteIds,
      isLoading,
      fetchFavorites,
      toggleFavorite,
      isProductFavorited,
      // 🌟 EXPOSE NEW VALUES
      recommendedProducts,
      isRecommendationsLoading,
      fetchRecommendations,
    }}>
      {children}
    </FavoriteContext.Provider>
  );
};

// Custom hook to use the context
export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};