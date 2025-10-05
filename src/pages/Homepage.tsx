// file path: components/pages/Homepage.tsx
import React, { useState, useEffect, useCallback } from 'react'; 
import { HeroSection } from '@/components/home/HeroSection';
import TopPicks from '@/components/home/TopPicks'; 
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, TrendingUp, Award, Loader2, Minimize2 } from 'lucide-react';

// ⚠️ MOCK IMAGE IMPORTS:
// NOTE: These mock imports are left for the 'Featured Products' section, 
// but the 'Deal of the Day' section will now use URLs from the API.
import productHeadphones from '@/assets/product-headphones.jpg';
import productSmartwatch from '@/assets/product-smartwatch.jpg';
import productCameraLens from '@/assets/product-camera-lens.jpg';
import productGamingLaptop from '@/assets/product-gaming-laptop.jpg';


// 🔑 NEW INTERFACE: Defines the structure of products fetched from the public API
interface ApprovedProduct {
    _id: string; 
    name: string; // The MongoDB field is often 'name' or 'title'
    price: string | number;
    imageUrl1: string;
    // Add other fields you need, like 'category', 'description' if you fetch them
}

// Interface for use in ProductCard (combining mock fields and real data)
interface DisplayProduct {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string; // This will be imageUrl1
    rating: number; // Mocked for now
    reviewCount: number; // Mocked for now
    seller: { name: string; rating: number }; // Mocked for now (public API doesn't return seller name)
    badge: string; // Mocked for now
}


// ⚠️ API BASE URL - Must match your backend
const API_BASE_URL = "https://beltrandsmarketbackend.onrender.com/api/products";

// Initial constants
const INITIAL_DEAL_COUNT = 4;
const LOAD_MORE_STEP = 4;


// --- Mock data for featured products (using mock data structure) ---
// This section is NOT fetched from the API and remains as is, using static imports.
const featuredProducts: DisplayProduct[] = [
  {
    id: '1',
    title: 'Premium Wireless Headphones with Active Noise Cancellation',
    price: 299.99,
    originalPrice: 399.99,
    image: productHeadphones,
    rating: 4.8,
    reviewCount: 1247,
    seller: { name: 'TechZone', rating: 4.9 },
    badge: 'Bestseller'
  },
  // ... (rest of the featured products)
  {
    id: '2',
    title: 'Smart Fitness Watch with Heart Rate Monitor',
    price: 199.99,
    originalPrice: 249.99,
    image: productSmartwatch,
    rating: 4.6,
    reviewCount: 892,
    seller: { name: 'FitTech', rating: 4.7 },
    badge: 'New'
  },
  {
    id: '3',
    title: 'Professional Camera Lens 50mm f/1.4',
    price: 449.99,
    image: productCameraLens,
    rating: 4.9,
    reviewCount: 324,
    seller: { name: 'PhotoPro', rating: 4.8 },
    badge: 'Pro Choice'
  },
  {
    id: '4',
    title: 'Ultra-Thin Gaming Laptop 15.6"',
    price: 1299.99,
    originalPrice: 1499.99,
    image: productGamingLaptop,
    rating: 4.7,
    reviewCount: 567,
    seller: { name: 'GameTech', rating: 4.6 },
    badge: 'Gaming'
  }
];


// 🔑 PRICE FORMATTER
const formatRwfPrice = (price: string | number): number => {
    // Converts the price string/number to a float, or defaults to 0
    const rawPrice = parseFloat(String(price));
    // NOTE: ProductCard expects a number for the price, so we just return the raw number.
    // The formatting (Rwf symbol, commas) should be done inside the ProductCard component
    // or we must adjust the ProductCard interface to accept a formatted string.
    // For now, let's assume ProductCard accepts a number and we will use the raw price.
    return isNaN(rawPrice) ? 0 : rawPrice;
};


export default function Homepage() {
  const [loading, setLoading] = useState(true); // Start loading immediately for deals
  const [deals, setDeals] = useState<DisplayProduct[]>([]); // State for fetched deals
  const [error, setError] = useState<string | null>(null);
  const [visibleDealCount, setVisibleDealCount] = useState(INITIAL_DEAL_COUNT);

  
  // ------------------------------------------------------------------
  // 1. FETCH APPROVED PRODUCTS
  // ------------------------------------------------------------------
  const fetchApprovedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 🔑 Use the new public endpoint
      const response = await fetch(`${API_BASE_URL}/public`); 

      if (!response.ok) {
        throw new Error(`Failed to fetch deals: ${response.statusText}`);
      }

      const productsData: ApprovedProduct[] = await response.json();

      // Map API data (ApprovedProduct) to the format expected by ProductCard (DisplayProduct)
      const mappedDeals: DisplayProduct[] = productsData.map((p, index) => ({
          id: p._id,
          title: p.name, // Use 'name' from the API response
          price: formatRwfPrice(p.price), // Convert to number
          originalPrice: formatRwfPrice(p.price) * 1.2, // Mock a sale price (20% discount)
          image: p.imageUrl1 || 'placeholder.jpg', // Use imageUrl1
          rating: 4.5, // Mock data
          reviewCount: Math.floor(Math.random() * 500) + 50, // Mock data
          seller: { name: 'Verified Seller', rating: 4.8 }, // Mock data
          badge: index % 2 === 0 ? 'Deal' : 'Hot Deal', // Mock data
      }));

      setDeals(mappedDeals);
    } catch (err: any) {
      console.error("Error fetching approved products:", err);
      setError("Could not load Deal of the Day. Please try again.");
      setDeals([]); // Use empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedProducts();
  }, [fetchApprovedProducts]);


  // ------------------------------------------------------------------
  // 2. DEAL RENDERING LOGIC
  // ------------------------------------------------------------------
  const allDealOfTheDayProducts = deals; // Use the fetched state for deals
  const visibleDeals = allDealOfTheDayProducts.slice(0, visibleDealCount);
  const hasMoreDeals = visibleDealCount < allDealOfTheDayProducts.length;
  const isExpanded = visibleDealCount > INITIAL_DEAL_COUNT;

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
  };

  const handleToggleWishlist = (productId: string) => {
    console.log('Toggle wishlist:', productId);
  };

  const handleChatWithSeller = (productId: string) => {
    console.log('Chat with seller:', productId);
  };

  const handleLoadMoreDeals = () => {
    if (loading || !hasMoreDeals) return;
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setVisibleDealCount(prevCount => Math.min(prevCount + LOAD_MORE_STEP, allDealOfTheDayProducts.length));
      setLoading(false);
    }, 500); // Reduced delay
  };

  const handleLoadLessDeals = () => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setVisibleDealCount(INITIAL_DEAL_COUNT); 
      setLoading(false);
      document.getElementById('deal-of-the-day')?.scrollIntoView({ behavior: 'smooth' });
    }, 300); // Short delay for collapsing
  };

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <HeroSection />
        </div>
      </div>

      {/* Top Picks Section */}
      <TopPicks />

      {/* Featured Products (Recommended for You) - Remains static */}
      <section className="py-12 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recommended for You</h2>
              <p className="text-muted-foreground">Based on your browsing history and preferences</p>
            </div>
            <Button variant="outline">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => handleAddToCart(product.id)}
                onToggleWishlist={() => handleToggleWishlist(product.id)}
                onChatWithSeller={() => handleChatWithSeller(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------- */}
      {/* --- Deal of the Day Section (API Data)--- */}
      {/* -------------------------------------- */}
      <section className="py-12 bg-background-secondary" id="deal-of-the-day">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Deal of the Day</h2>
              <p className="text-muted-foreground">Limited time offers just for you</p>
            </div>
            <Button variant="outline">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          {/* Loading/Error States */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 mr-2 animate-spin text-primary" />
              <span className="text-xl text-muted-foreground">Fetching today's best deals...</span>
            </div>
          )}
          
          {error && !loading && (
            <div className="text-center py-12 text-red-500 border border-red-300 rounded-lg p-6 bg-red-50/50">
                {error}
                <Button onClick={fetchApprovedProducts} variant="ghost" className="ml-4 text-red-500">Retry</Button>
            </div>
          )}

          {/* Display Deals */}
          {!loading && !error && visibleDeals.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleDeals.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onAddToCart={() => handleAddToCart(product.id)}
                    onToggleWishlist={() => handleToggleWishlist(product.id)}
                    onChatWithSeller={() => handleChatWithSeller(product.id)}
                  />
                ))}
              </div>
          )}

          {!loading && !error && deals.length === 0 && (
             <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg p-6">
                <p className="text-xl">No active deals right now. Check back soon!</p>
             </div>
          )}

          {/* Action Buttons Container */}
          {deals.length > 0 && (
            <div className="mt-10 flex justify-center space-x-4">
              
              {/* Load Less Button (Visible when expanded) */}
              {isExpanded && (
                <Button
                  onClick={handleLoadLessDeals}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                >
                  <Minimize2 className="mr-2 h-5 w-5" />
                  Collapse
                </Button>
              )}

              {/* Load More Button (Visible when there are more deals) */}
              {hasMoreDeals && (
                <Button
                  onClick={handleLoadMoreDeals}
                  disabled={loading}
                  variant="default"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading Deals...
                    </>
                  ) : (
                    <>
                      Load More Deals ({allDealOfTheDayProducts.length - visibleDealCount} remaining)
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

        </div>
      </section>

      {/* --- Stats Section --- */}
     <section className="py-16 bg-gradient-to-r from-[#87520c] to-[#ed9707]">
        <div className="max-w-7xl mx-auto px-4">
          <div className=" rounded-2xl p-4  bg-white/30 backdrop-blur-lg border border-white/20">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#fff' }}>
              Why Choose Our Marketplace?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center text-white">
                <div className="glass-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-2xl font-bold mb-2">10M+</h3>
                <p className="text-white/80">Products Available</p>
              </div>
              <div className="text-center text-white">
                <div className="glass-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold mb-2">5M+</h3>
                <p className="text-white/80">Happy Customers</p>
              </div>
              <div className="text-center text-white">
                <div className="glass-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">99.9%</h3>
                <p className="text-white/80">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}