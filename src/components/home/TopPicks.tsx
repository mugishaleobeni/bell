import React, { useState, useRef } from 'react'; 
import { ArrowRight, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// --- SWIPER IMPORTS ---
import 'swiper/css';
import 'swiper/css/navigation'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; 

// --- ONLINE IMAGE URLS MAPPING (Data omitted for brevity) ---
const ONLINE_IMAGES = {
    mobile_primary: 'https://market-resized.envatousercontent.com/3docean.net/files/645303424/590.jpg?auto=format&q=85&cf_fit=crop&gravity=top&h=8000&w=590&s=1f6882ead8bda9badcb70b2f83885884b139c59c7225dfd9b8f48e420b7247dc',
    mobile_secondary: 'https://market-resized.envatousercontent.com/3docean.net/files/596045354/590.jpg?auto=format&q=85&cf_fit=crop&gravity=top&h=8000&w=590&s=dac8b8dd14f9bf54ac087e5108d9526bd0471297cdb0c6becbcc1f29cff2607d',
    mobile_tertiary: 'https://www.gorefurbo.com/cdn/shop/collections/Refurbished_Mobile_Phones_1.jpg?v=1695978895',
    // ... (rest of image URLs)
    laptops_primary: 'https://www.reliablesoft.net/wp-content/uploads/2017/07/homepage-seo-ecommerce.jpg',
    laptops_secondary: 'https://m.media-amazon.com/images/I/51X7VKq-4DL.jpg',
    laptops_tertiary: 'https://crdms.images.consumerreports.org/prod/products/cr/models/410668-all-in-one-desktops-hp-pavilion-27-ca2244-10036475.png',
    audio_primary: 'https://i.ebayimg.com/images/g/ss0AAOSwwYZmMjn3/s-l1200.png',
    audio_secondary: 'https://surplustronics.co.nz/product/170.114/35753-medium.jpg?1674177798',
    audio_tertiary: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8GsaefsLjhwwanLv8BHF7MZ78c4kSr4Wfag&s',
    womens_primary: 'https://www.shutterstock.com/image-vector/female-dresses-mockup-collection-dress-260nw-1868679853.jpg', 
    womens_secondary: 'https://www.shutterstock.com/image-photo/milan-italy-january-82018-louis-260nw-1277956846.jpg',
    womens_tertiary: 'https://images.vestiairecollective.com/images/resized/w=1024,h=1024,q=75,f=auto,/produit/48708556-1_2.jpg',
    mens_primary: 'https://static.vecteezy.com/system/resources/thumbnails/038/936/025/small/ai-generated-men-s-suits-in-a-shop-window-luxury-and-fashionable-clothing-photo.jpg',
    mens_secondary: 'https://www.gosanangelo.com/gcdn/presto/2021/12/16/PSAT/965f9a4f-7367-41a4-9aff-0a6651beb3ff-IMG_0763.jpg?width=1200&disable=upscale&format=pjpg&auto=webp',
    mens_tertiary: 'https://img.freepik.com/premium-photo/colorful-pants-store-new-clothes-shopping-colorful-men-s-women-s-pants-hangers_345343-8860.jpg',
    home_primary: 'https://www.shutterstock.com/image-illustration/3d-render-home-appliances-collection-260nw-1668941440.jpg',
    home_secondary: 'https://global.derucci.com/cdn/shop/files/2_cc9e0a22-395c-4781-b839-8bde8510606c.jpg?v=1722126126&width=1500',
    home_tertiary: 'https://ecdn6.globalso.com/upload/p/81/image_product/2023-12/65700df334c3c48393.jpg',
    fitness_primary: 'https://m.media-amazon.com/images/I/71AyxR0yeeL.jpg',
    fitness_secondary: 'https://m.media-amazon.com/images/I/71N54ip6SaL._AC_SL1500_.jpg',
    fitness_tertiary: 'https://m.media-amazon.com/images/I/710sSijJy9L.jpg',
    general_8: 'https://c0.lestechnophiles.com/images.frandroid.com/wp-content/uploads/2024/09/airpods-4-vs-airpods-pro-2.jpg?resize=1200&key=07860941&watermark',
    general_9: 'https://capitaloil.co.mz/wp-content/uploads/2022/02/iStock-927781468.jpg',
    general_10: 'https://www.hillspet.com/content/dam/cp-sites-aem/hills/hills-pet/mlp-assets/home-page/Home_Ingredients_MixFood_Desktop_744x547_2x.png',
    general_11: 'https://m.media-amazon.com/images/I/61m96S5cOgL._UF894,1000_QL80_.jpg',
    general_12: 'https://annainthehouse.com/wp-content/uploads/2021/01/food-covers-2-800x533.jpg',
    general_13: 'https://blog.serchen.com/wp-content/uploads/2024/02/office-supplies-list.jpg',
};

const initialPicks = [
    {
        id: 1,
        title: 'Mobile Phones',
        image: ONLINE_IMAGES.mobile_primary,
        secondaryImage: ONLINE_IMAGES.mobile_secondary,
        tertiaryImage: ONLINE_IMAGES.mobile_tertiary,
        subcategories: ['Android', 'iPhone', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Other Brands'],
        link: '/category/electronics/mobile-phones'
    },
    {
        id: 2,
        title: 'Laptops & PCs',
        image: ONLINE_IMAGES.laptops_primary,
        secondaryImage: ONLINE_IMAGES.laptops_secondary,
        tertiaryImage: ONLINE_IMAGES.laptops_tertiary,
        subcategories: ['Gaming Laptops', 'Business Laptops', 'Desktop PCs', 'MacBooks', 'Chromebooks', 'Accessories'],
        link: '/category/electronics/computers'
    },
    {
        id: 3,
        title: 'Headphones & Audio',
        image: ONLINE_IMAGES.audio_primary,
        secondaryImage: ONLINE_IMAGES.audio_secondary,
        tertiaryImage: ONLINE_IMAGES.audio_tertiary,
        subcategories: ['JBL', 'Sony', 'Bose', 'Apple AirPods', 'Samsung Buds', 'Gaming Headsets', 'Speakers'],
        link: '/category/electronics/audio'
    },
    {
        id: 4,
        title: "Women's Clothing",
        image: ONLINE_IMAGES.womens_primary,
        secondaryImage: ONLINE_IMAGES.womens_secondary,
        tertiaryImage: ONLINE_IMAGES.womens_tertiary,
        subcategories: ['Dresses', 'Tops & Blouses', 'Pants & Jeans', 'Skirts', 'Outerwear', 'Activewear', 'Underwear'],
        link: '/category/fashion/womens'
    },
    {
        id: 5,
        title: "Men's Clothing",
        image: ONLINE_IMAGES.mens_primary,
        secondaryImage: ONLINE_IMAGES.mens_secondary,
        tertiaryImage: ONLINE_IMAGES.mens_tertiary,
        subcategories: ['Shirts', 'T-Shirts', 'Pants & Jeans', 'Shorts', 'Suits', 'Activewear', 'Underwear'],
        link: '/category/fashion/mens'
    },
    {
        id: 6,
        title: 'Home & Kitchen',
        image: ONLINE_IMAGES.home_primary,
        secondaryImage: ONLINE_IMAGES.home_secondary,
        tertiaryImage: ONLINE_IMAGES.home_tertiary,
        subcategories: ['Furniture', 'Appliances', 'Decor', 'Kitchen Tools', 'Bedding', 'Storage'],
        link: '/category/home-kitchen'
    },
    {
        id: 7,
        title: 'Sports & Fitness',
        image: ONLINE_IMAGES.fitness_primary,
        secondaryImage: ONLINE_IMAGES.fitness_secondary,
        tertiaryImage: ONLINE_IMAGES.fitness_tertiary,
        subcategories: ['Exercise Equipment', 'Sportswear', 'Outdoor Gear', 'Supplements', 'Yoga & Pilates'],
        link: '/category/sports-fitness'
    },
];

const additionalPicks = [
    {
        id: 8,
        title: 'Books & Media',
        image: ONLINE_IMAGES.general_8,
        secondaryImage: ONLINE_IMAGES.general_8,
        tertiaryImage: ONLINE_IMAGES.general_8,
        subcategories: ['Fiction', 'Educational', 'E-books'],
        link: '/category/books'
    },
    {
        id: 9,
        title: 'Automotive',
        image: ONLINE_IMAGES.general_9,
        secondaryImage: ONLINE_IMAGES.general_9,
        tertiaryImage: ONLINE_IMAGES.general_9,
        subcategories: ['Parts', 'Accessories', 'Tools'],
        link: '/category/automotive'
    },
    {
        id: 10,
        title: 'Pet Supplies',
        image: ONLINE_IMAGES.general_10,
        secondaryImage: ONLINE_IMAGES.general_10,
        tertiaryImage: ONLINE_IMAGES.general_10,
        subcategories: ['Food', 'Toys', 'Health'],
        link: '/category/pets'
    },
    {
        id: 11,
        title: 'Garden & Outdoor',
        image: ONLINE_IMAGES.general_11,
        secondaryImage: ONLINE_IMAGES.general_11,
        tertiaryImage: ONLINE_IMAGES.general_11,
        subcategories: ['Plants', 'Tools', 'Furniture'],
        link: '/category/garden'
    },
    {
        id: 12,
        title: 'Baby & Kids',
        image: ONLINE_IMAGES.general_12,
        secondaryImage: ONLINE_IMAGES.general_12,
        tertiaryImage: ONLINE_IMAGES.general_12,
        subcategories: ['Clothing', 'Toys', 'Feeding'],
        link: '/category/baby-kids'
    },
    {
        id: 13,
        title: 'Office Supplies',
        image: ONLINE_IMAGES.general_13,
        secondaryImage: ONLINE_IMAGES.general_13,
        tertiaryImage: ONLINE_IMAGES.general_13,
        subcategories: ['Stationery', 'Furniture', 'Tech'],
        link: '/category/office'
    },
];


// 🌟 FIX: Removed the 'export' keyword from the function definition.
function TopPicks() {
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const swiperRefs = useRef([]);
  const setSwiperRef = (swiper, index) => {
    if (swiper) {
      swiperRefs.current[index] = swiper;
    }
  };

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShowMore(true);
      setLoading(false);
    }, 800);
  };
    
  const handleShowLess = () => {
    setShowMore(false);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleNextSlide = (index) => {
    if (swiperRefs.current[index]) {
      swiperRefs.current[index].slideNext();
    }
  };

  const displayedPicks = showMore ? [...initialPicks, ...additionalPicks] : initialPicks;

  const primaryButtonClasses = "min-w-48 border-primary text-primary hover:bg-primary/10 transition-colors hover:text-primary";

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Top Picks for You</h2>
            <p className="text-muted-foreground">Curated collections based on your interests</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Categories
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Confirmed Fix: Grid uses grid-cols-1 by default */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedPicks.map((pick, index) => ( 
            <Link 
              key={pick.id} 
              to={pick.link} 
            >
              <div className="glass-card transition-all duration-300">
                
                {/* --- SWIPER IMPLEMENTATION --- */}
                <div className="aspect-square overflow-hidden rounded-t-lg">
                    <Swiper
                        onSwiper={(swiper) => setSwiperRef(swiper, index)} 
                        navigation={false} 
                        modules={[Navigation]} 
                        loop={true} 
                        className="w-full h-full" 
                    >
                        <SwiperSlide>
                            <img src={pick.image} alt={pick.title + ' View 1'} className="w-full h-full object-cover" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={pick.secondaryImage} alt={pick.title + ' View 2'} className="w-full h-full object-cover" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src={pick.tertiaryImage} alt={pick.title + ' View 3'} className="w-full h-full object-cover" />
                        </SwiperSlide>
                    </Swiper>
                </div>
                {/* --- END SWIPER IMPLEMENTATION --- */}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-primary">
                        {pick.title}
                      </h3>
                      
                      {/* Image Change Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            handleNextSlide(index);
                        }}
                        className="h-7 w-7 flex-shrink-0 border-primary text-primary hover:bg-primary/10 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                  </div>
                  
                  <div className="space-y-1">
                    {/* Subcategories */}
                    {pick.subcategories.slice(0, 4).map((sub, subIndex) => (
                      <div key={subIndex} className="flex items-center text-sm text-muted-foreground transition-colors">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        {sub}
                      </div>
                    ))}
                    {pick.subcategories.length > 4 && (
                        <div className="flex items-center text-sm text-muted-foreground italic">
                            ... and {pick.subcategories.length - 4} more
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- Load More / Show Less Button Logic --- */}
        <div className="text-center mt-8">
            
            {!showMore && additionalPicks.length > 0 && (
                <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={loading}
                className={primaryButtonClasses}
                >
                {loading ? (
                    <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading More Picks...
                    </div>
                ) : (
                    <>
                    Load More ({additionalPicks.length})
                    <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                )}
                </Button>
            )}

            {showMore && (
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShowLess}
                    className={primaryButtonClasses}
                >
                    Show Less
                    <ChevronRight className="w-4 h-4 ml-2 rotate-[-90deg]" />
                </Button>
            )}
        </div>
        {/* --- END Button Logic --- */}
      </div>
    </section>
  );
}

// 🌟 CORRECT EXPORT: Only the default export remains.
export default TopPicks;