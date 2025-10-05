import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// --- 1. Product Interfaces ---
interface ProductVariant {
  name: string;
  options: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  primaryCategory: string;
  subCategory: string;
  aiEnabled: boolean;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
  imageUrl4: string;
  imageUrl: string;
  seller_id: string;
  variants?: ProductVariant[];
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  seller_id: string;
}

// 🌟 NEW INTERFACE for the dynamically fetched Seller
interface Seller {
    id: string;
    name: string;
    // Add other fields you might get from your seller API
}

// MOCK data is kept only for the static rating/sales structure
const API_BASE_URL = 'https://beltrandsmarketbackend.onrender.com/api/productsx';
const MOCK_SELLER_RATING_INFO = { rating: 4.8, totalSales: 850 };
// 🌟 FIX: Updated SELLER_API_BASE_URL to match the new backend route
const SELLER_API_BASE_URL = 'https://beltrandsmarketbackend.onrender.com/api/productsx/seller-info'; 


// --- 2. Custom Styles (for effects Tailwind can't handle) ---
const styles: { [key: string]: React.CSSProperties | any } = {
  '@global': {
    // Light Mode (Default)
    ':root': {
      '--bg-color': '#f8fafc',
      '--card-bg': 'rgba(255, 255, 255, 0.9)', // Slightly opaque white
      '--text-color': '#1f2937', // Gray-900
      '--text-secondary': '#6b7280', // Gray-500
      '--border-color': 'rgba(0, 0, 0, 0.1)',
      '--shadow-color': 'rgba(0, 0, 0, 0.15)',
      '--accent-color': '#2563eb', // Blue-600
    },
    // Dark Mode
    '.dark-mode': {
      '--bg-color': '#1f2937', // Gray-800
      '--card-bg': 'rgba(31, 41, 55, 0.95)', // Slightly opaque Gray-800
      '--text-color': '#f9fafb', // Gray-50
      '--text-secondary': '#9ca3af', // Gray-400
      '--border-color': 'rgba(255, 255, 255, 0.15)',
      '--shadow-color': 'rgba(0, 0, 0, 0.6)', // Darker shadow for depth
      '--accent-color': '#60a5fa', // Blue-400
    },
    // Global keyframes for fade-in effect
    '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(10px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
    '.animate-fadeIn': {
        animation: 'fadeIn 0.5s ease-out forwards',
    }
  },
  darkCompatible: {
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  mainImage: {
    transition: 'transform 0.3s ease',
  },
  // Ensure glass card respects the background/border colors of the mode
  glassCard: {
    backgroundColor: 'var(--card-bg)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid var(--border-color)',
    boxShadow: '0 10px 40px var(--shadow-color)',
  },
  // ... other styles (variantButton, relatedCardContainer, etc. are fine)
  variantButton: {
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  },
  variantButtonSelected: {
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    borderColor: 'var(--accent-color)',
  },
  relatedCardContainer: {
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  },
  relatedImage: {
    transition: 'transform 0.5s ease-in-out',
  },
};

// --- 3. Main Component ---
const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(true);
  const [sellerInfo, setSellerInfo] = useState<Seller | null>(null);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState<number>(1);
  
  // 🌟 State to track current mode for dynamic class usage 🌟
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); 

  // Inject global styles and check for initial dark mode state
  useEffect(() => {
    // Inject custom CSS variables and keyframes
    const styleSheet = document.createElement('style');
    let globalCss = '';
    if (styles['@global']) {
      Object.entries(styles['@global']).forEach(([key, value]) => {
          if (typeof value === 'object') {
              // Convert nested object (like :root or .dark-mode) to CSS string
              const cssProps = Object.entries(value).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(';');
              globalCss += `${key} { ${cssProps} }`;
          } else if (key.startsWith('@')) {
              // Directly include keyframes or other at-rules
              globalCss += value;
          }
      });
    }
    styleSheet.textContent = globalCss;
    document.head.appendChild(styleSheet);

    // Initial check for dark mode
    const checkDarkMode = () => {
        const dark = document.documentElement.classList.contains('dark-mode');
        setIsDarkMode(dark);
    };
    checkDarkMode();

    // Setup an observer if you need to react to dynamic changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      document.head.removeChild(styleSheet);
      observer.disconnect();
    };
  }, []);


  // --- Data Fetching Logic (1: Main Product Details) ---
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setError("Error: Product ID is missing from the URL.");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}/${productId}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        const data: Product = await response.json();
        setProduct(data);

        const initialImages = [data.imageUrl, data.imageUrl1, data.imageUrl2, data.imageUrl3, data.imageUrl4]
          .filter((url): url is string => !!url && url.length > 0);
        if (initialImages.length > 0) {
          setSelectedImage(initialImages[0]);
        }
        
        if (data.variants) {
          const initialOptions: { [key: string]: string } = {};
          data.variants.forEach((variant) => {
            initialOptions[variant.name] = variant.options[0] || '';
          });
          setSelectedOptions(initialOptions);
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "An unknown network error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // --- Data Fetching Logic (2: Fetch Seller Info) 🌟 UPDATED EFFECT (404 and URL fix) 🌟
  useEffect(() => {
    if (product && product.seller_id) {
        const fetchSeller = async () => {
            try {
                // 🌟 FIX: Uses the updated SELLER_API_BASE_URL
                const url = `${SELLER_API_BASE_URL}/${product.seller_id}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    // 🌟 Handles 404 specifically as requested
                    if (response.status === 404) {
                       setSellerInfo({ id: product.seller_id, name: "Seller Not Found (404)" }); 
                       return;
                    }
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }
                
                const data: Seller = await response.json();
                setSellerInfo(data);
            } catch (e: any) {
                console.error("Error fetching seller info:", e);
                setSellerInfo({ id: product.seller_id, name: `API Error: ${e.message.split(':').pop()}` }); // Fallback with error clue
            }
        };
        fetchSeller();
    }
  }, [product]); // Runs when the main product is loaded

  // --- Data Fetching Logic (3: Related Products by Seller ID) ---
  useEffect(() => {
    if (product && product.seller_id) {
      setRelatedLoading(true);

      const fetchRelatedProducts = async () => {
        try {
          const url = `${API_BASE_URL}/seller/${product.seller_id}?exclude_id=${product.id}`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
          }

          const data: RelatedProduct[] = await response.json();
          setRelatedProducts(data);
        } catch (e) {
          console.error("Error fetching related products:", e);
          setRelatedProducts([]);
        } finally {
          setRelatedLoading(false);
        }
      };

      fetchRelatedProducts();
    }
  }, [product]);

  // Handlers
  const handleAddToCart = () => {
    console.log("Added to cart:", { productId, quantity, options: selectedOptions });
  };

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [variantName]: option }));
  };

  const imageUrls = [product?.imageUrl, product?.imageUrl1, product?.imageUrl2, product?.imageUrl3, product?.imageUrl4]
    .filter((url): url is string => !!url && url.length > 0);

  // Render Logic
  if (loading) return <div className="p-12 text-center text-xl text-gray-500" style={styles.darkCompatible}>Loading product details...</div>;
  if (error) return <div className="p-12 text-center border-2 border-red-500 rounded-lg text-red-500" style={styles.darkCompatible}>Error: {error}</div>;
  if (!product) return <div className="p-12 text-center border-2 border-red-500 rounded-lg text-red-500" style={styles.darkCompatible}>No product data could be loaded.</div>;

  // DYNAMIC SELLER NAME
  const currentSellerName = sellerInfo ? sellerInfo.name : "Loading Seller...";
  
  // Dynamic Tailwind Classes based on mode for elements not covered by custom styles
  const textGraySecondary = isDarkMode ? 'text-gray-400' : 'text-gray-700';

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-[80vh] font-inter" style={styles.darkCompatible}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="animate-fadeIn">
          <img
            src={selectedImage || product.imageUrl}
            alt={product.name}
            className="w-full max-h-[500px] object-contain rounded-xl border border-gray-200 shadow-lg"
            style={{ 
              ...styles.mainImage,
              // Apply border color dynamically
              borderColor: isDarkMode ? 'var(--border-color)' : '#e5e7eb' // gray-200
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index + 1}`}
                // Use dynamic border colors for light/dark mode compatibility
                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer 
                  ${url === selectedImage ? 'border-[var(--accent-color)]' : isDarkMode ? 'border-[var(--border-color)]' : 'border-gray-200'} 
                  hover:border-[var(--accent-color)] hover:scale-105`}
                style={styles.thumbnail}
                onClick={() => setSelectedImage(url)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedImage(url);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Details & Actions */}
        <div>
          <h1 className="text-3xl font-bold border-b pb-3 mb-4" 
              style={{ borderColor: isDarkMode ? 'var(--border-color)' : '#e5e7eb' }}>
            {product.name}
          </h1>
          <p className="text-sm uppercase tracking-wide mb-6" style={{ color: 'var(--text-secondary)' }}>
            {product.primaryCategory} &gt; {product.subCategory}
          </p>

          <div className="flex justify-between items-center border-b py-4"
               style={{ borderColor: isDarkMode ? 'var(--border-color)' : '#e5e7eb' }}>
            <p className="text-3xl font-bold text-red-600">Rwf {product.price.toFixed(2)}</p>
            <p className={`text-base font-semibold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </p>
          </div>

          {/* Variants and Quantity */}
          <div className="py-6">
            {product.variants && product.variants.length > 0 && (
              <>
                {product.variants.map((variant) => (
                  <div key={variant.name} className="mb-4">
                    <label className="block text-base font-medium mb-2">{variant.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => (
                        <button
                          key={option}
                          className={`px-4 py-2 border rounded-md text-sm ${
                            selectedOptions[variant.name] === option
                              ? '' // Styles handled by style object
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-50 hover:bg-gray-600' // Dark mode unselected
                                : 'bg-white text-gray-700 hover:bg-gray-100' // Light mode unselected
                          }`}
                          style={{
                            ...styles.variantButton,
                            borderColor: isDarkMode ? 'var(--border-color)' : '#e5e7eb',
                            ...(selectedOptions[variant.name] === option
                              ? styles.variantButtonSelected
                              : {}),
                          }}
                          onClick={() => handleVariantChange(variant.name, option)}
                          aria-pressed={selectedOptions[variant.name] === option}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="flex items-center gap-3 mt-4">
              <label className="text-base font-medium">Quantity:</label>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className={`px-4 py-2 border rounded-md text-xl hover:bg-gray-100 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700'}`}
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                style={{ ...styles.variantButton, borderColor: 'var(--border-color)' }}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                readOnly
                className={`w-16 text-center py-2 border rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
                aria-label="Quantity"
                style={{ ...styles.variantButton, borderColor: 'var(--border-color)' }}
              />
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className={`px-4 py-2 border rounded-md text-xl hover:bg-gray-100 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700'}`}
                aria-label="Increase quantity"
                disabled={product.stock === 0 || quantity >= product.stock}
                style={{ ...styles.variantButton, borderColor: 'var(--border-color)' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              className={`flex-1 py-3 px-6 bg-amber-500 text-white rounded-lg font-semibold text-base hover:bg-amber-600 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed`}
              style={styles.cartButton}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-label="Add to cart"
            >
              🛒 Add to Cart
            </button>
          </div>

          {/* Seller Information */}
          <div className="mt-6 p-6 rounded-xl" style={styles.glassCard}>
            <h3 className="text-lg font-semibold mb-2">Seller: {currentSellerName}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              ⭐ Rating: {MOCK_SELLER_RATING_INFO.rating} (Total Sales: {MOCK_SELLER_RATING_INFO.totalSales})
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12">
        {/* Description */}
        <div className="mb-8 py-4">
          <h3 className="text-xl font-semibold mb-4">Detailed Description</h3>
          {/* 🌟 FIX: Applied dynamic text color for description */}
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{product.description}</p>
        </div>

        {/* Feedback/Reviews */}
        <div className="mb-12 py-6 border-t" style={{ borderColor: isDarkMode ? 'var(--border-color)' : '#e5e7eb' }}>
          <h3 className="text-xl font-semibold mb-4">Feedback & Customer Reviews</h3>
          <div className="p-6 border border-dashed rounded-lg text-center" 
               style={{ ...styles.glassCard, borderColor: isDarkMode ? 'var(--border-color)' : '#9ca3af' }}>
            <p style={{ color: 'var(--text-secondary)' }}>This space is ready for customer feedback fetched from the database.</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700" aria-label="Write a review">
              Write a Review
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedLoading && (
          <div className="p-12 text-center text-xl" style={styles.darkCompatible}>
            Loading seller's other products...
          </div>
        )}
        {!relatedLoading && relatedProducts.length > 0 && (
          <div className="py-6 border-t" style={{ borderColor: isDarkMode ? 'var(--border-color)' : '#e5e7eb' }}>
            <h3 className="text-xl font-semibold mb-4">More products from {currentSellerName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl overflow-hidden animate-fadeIn"
                  style={{ ...styles.relatedCardContainer, animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px var(--shadow-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px var(--shadow-color)';
                  }}
                >
                  <a
                    href={`/product/${item.id}`}
                    className="flex flex-col h-full no-underline"
                    style={styles.glassCard}
                    aria-label={`View ${item.name}`}
                  >
                    <div className="aspect-square overflow-hidden border-b" style={{ borderColor: isDarkMode ? 'var(--border-color)' : '#e5e7eb' }}>
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/200'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        style={styles.relatedImage}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <p className="text-base font-medium mb-2 line-clamp-2" style={{ color: 'var(--text-color)' }}>{item.name}</p>
                      <p className="text-lg font-bold text-red-600 mb-2">
                        Rwf {item.price?.toFixed(2) || 'N/A'}
                      </p>
                      <div className="flex justify-between items-center text-sm pt-2 border-t" style={{ color: 'var(--text-secondary)', borderColor: isDarkMode ? 'var(--border-color)' : '#f3f4f6' }}>
                        <span>by {currentSellerName}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span>{MOCK_SELLER_RATING_INFO.rating}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;