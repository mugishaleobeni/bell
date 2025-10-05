// file path: components/pages/Homepage.tsx
import React, { useState, useEffect, useCallback } from 'react'; 
import { HeroSection } from '@/components/home/HeroSection';
import TopPicks from '@/components/home/TopPicks'; 
import { ProductCard } from '@/components/product/ProductCard'; 
import { Button } from '@/components/ui/button';
// 🛑 ADDED: Heart for the Recommended section heading
import { ArrowRight, Zap, TrendingUp, Award, Loader2, Minimize2, Heart } from 'lucide-react'; 

// 🌟 NEW: Import the useFavorites hook
import { useFavorites } from '@/contexts/FavoriteContext'; 

// MOCK IMAGE IMPORTS (Unchanged)
import productHeadphones from '@/assets/product-headphones.jpg';
import productSmartwatch from '@/assets/product-smartwatch.jpg';
import productCameraLens from '@/assets/product-camera-lens.jpg';
import productGamingLaptop from '@/assets/product-gaming-laptop.jpg';


// 🔑 NEW INTERFACE: Defines the structure of products fetched from the public API (Unchanged)
interface ApprovedProduct {
    _id: string; 
    name: string;
    price: string | number;
    imageUrl1: string;
}

// Interface for use in ProductCard (Unchanged)
interface DisplayProduct {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    seller: { name: string; rating: number };
    badge?: string; // Made optional as recommendations might not have them
}


// ⚠️ API BASE URL - Must match your backend
const API_BASE_URL = "https://beltrandsmarketbackend.onrender.com/api/products";

// Initial constants (Unchanged)
const INITIAL_DEAL_COUNT = 4;
const LOAD_MORE_STEP = 4;


// --- Mock data for featured products (REMOVE FOR RECOMMENDATIONS) ---
// We will keep this static data structure only for mapping simplicity later, but will use the live data.
// const featuredProducts: DisplayProduct[] = [...] 


// 🔑 PRICE FORMATTER (Unchanged)
const formatRwfPrice = (price: string | number): number => {
    const rawPrice = parseFloat(String(price));
    return isNaN(rawPrice) ? 0 : rawPrice;
};


export default function Homepage() {
  // ------------------------------------------------------------------
  // 🌟 NEW STATE/CONTEXT HOOKS
  // ------------------------------------------------------------------
  const { 
    recommendedProducts, 
    fetchRecommendations, 
    isRecommendationsLoading 
  } = useFavorites();
  
  // ------------------------------------------------------------------
  // EXISTING STATE HOOKS (Unchanged)
  // ------------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<DisplayProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visibleDealCount, setVisibleDealCount] = useState(INITIAL_DEAL_COUNT);

  
  // ------------------------------------------------------------------
  // 1. FETCH APPROVED PRODUCTS (Unchanged)
  // ------------------------------------------------------------------
  const fetchApprovedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/public`); 

      if (!response.ok) {
        throw new Error(`Failed to fetch deals: ${response.statusText}`);
      }

      const productsData: ApprovedProduct[] = await response.json();

      const mappedDeals: DisplayProduct[] = productsData.map((p, index) => ({
          id: p._id,
          title: p.name,
          price: formatRwfPrice(p.price),
          originalPrice: formatRwfPrice(p.price) * 1.2,
          image: p.imageUrl1 || 'placeholder.jpg',
          rating: 4.5,
          reviewCount: Math.floor(Math.random() * 500) + 50,
          seller: { name: 'Verified Seller', rating: 4.8 },
          badge: index % 2 === 0 ? 'Deal' : 'Hot Deal',
      }));

      setDeals(mappedDeals);
    } catch (err: any) {
      console.error("Error fetching approved products:", err);
      setError("Could not load Deal of the Day. Please try again.");
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // 2. LIFECYCLE HOOKS
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchApprovedProducts();
  }, [fetchApprovedProducts]);

  // 🌟 NEW LIFECYCLE HOOK: Fetch recommendations on mount
  useEffect(() => {
    // This function checks isLoggedIn internally, ensuring the user is ready.
    fetchRecommendations();
  }, [fetchRecommendations]); 

  // ------------------------------------------------------------------
  // 3. DEAL RENDERING LOGIC & HANDLERS (Unchanged)
  // ------------------------------------------------------------------
  const allDealOfTheDayProducts = deals;
  const visibleDeals = allDealOfTheDayProducts.slice(0, visibleDealCount);
  const hasMoreDeals = visibleDealCount < allDealOfTheDayProducts.length;
  const isExpanded = visibleDealCount > INITIAL_DEAL_COUNT;

  const handleLoadMoreDeals = () => {
    if (loading || !hasMoreDeals) return;
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setVisibleDealCount(prevCount => Math.min(prevCount + LOAD_MORE_STEP, allDealOfTheDayProducts.length));
      setLoading(false);
    }, 500); 
  };

  const handleLoadLessDeals = () => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setVisibleDealCount(INITIAL_DEAL_COUNT); 
      setLoading(false);
      document.getElementById('deal-of-the-day')?.scrollIntoView({ behavior: 'smooth' });
    }, 300); 
  };


  // ------------------------------------------------------------------
  // 4. HELPER: Maps API Recommendation structure to DisplayProduct structure
  // ------------------------------------------------------------------
  const mappedRecommendations: DisplayProduct[] = recommendedProducts.map(p => ({
    id: p._id,
    title: p.name,
    price: formatRwfPrice(p.price),
    originalPrice: undefined, // Recommendations may not have a fixed sale price
    image: p.imageUrl1 || 'placeholder.jpg',
    rating: p.rating || 4.0,
    reviewCount: p.reviewCount || 0,
    seller: p.seller || { name: 'Market Seller', rating: 4.5 },
    badge: 'Recommended', // Consistent badge for recommended items
  }));


  return (
    <div className="min-h-screen">
      
      {/* Hero Section (Unchanged) */}
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <HeroSection />
        </div>
      </div>

      {/* Top Picks Section (Unchanged) */}
      <TopPicks />

      {/* ------------------------------------------------------------------ */}
      {/* 🌟 RECOMMENDED PRODUCTS (LIVE DATA) */}
      {/* ------------------------------------------------------------------ */}
      {mappedRecommendations.length > 0 && (
        <section className="py-12 bg-background-secondary">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary fill-primary/80" />
                  Recommended for You
                </h2>
                <p className="text-muted-foreground">Based on your wishlist and browsing history</p>
              </div>
              <Button variant="outline">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            {isRecommendationsLoading ? (
               <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 mr-2 animate-spin text-primary" />
                <span className="text-muted-foreground">Generating personalized picks...</span>
               </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {mappedRecommendations.map((product) => (
                      <ProductCard
                        key={product.id}
                        {...product}
                      />
                    ))}
                </div>
            )}
          </div>
        </section>
      )}

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
          
          {/* Loading/Error States (Unchanged) */}
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

          {/* Display Deals - RENDERED WITHOUT OBSOLETE PROPS */}
          {!loading && !error && visibleDeals.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleDeals.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                ))}
              </div>
          )}

          {!loading && !error && deals.length === 0 && (
             <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg p-6">
                <p className="text-xl">No active deals right now. Check back soon!</p>
             </div>
          )}

          {/* Action Buttons Container (Unchanged) */}
          {deals.length > 0 && (
            <div className="mt-10 flex justify-center space-x-4">
              
              {/* Load Less Button */}
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

              {/* Load More Button */}
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

      {/* --- Stats Section (Unchanged) --- */}
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