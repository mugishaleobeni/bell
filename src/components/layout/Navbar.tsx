import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, MessageCircle, Package, User, Menu, ChevronDown, ChevronUp, Store, Sun, Moon, X, Settings } from 'lucide-react'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { LoginRegisterDropdown } from '@/components/auth/LoginRegisterDropdown'; 
import { useTheme } from '@/contexts/ThemeContext';
import { CartDropdown } from '@/components/layout/CartDropdown';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext'; 
import { Separator } from '@/components/ui/separator'; // Assuming you have a separator component

// Helper Icons (kept as is)
const SettingsIcon = (props: any) => (<Settings className="w-4 h-4 mr-2" {...props} />);
const LogoutIcon = (props: any) => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>);

const categories = [
  { name: 'Mobile Phones', subcategories: ['Android', 'iPhone', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Other Brands'] },
  { name: 'Laptops & PCs', subcategories: ['Gaming Laptops', 'Business Laptops', 'Desktop PCs', 'MacBooks', 'Chromebooks', 'Accessories'] },
  { name: 'Headphones & Audio', subcategories: ['JBL', 'Sony', 'Bose', 'Apple AirPods', 'Samsung Buds', 'Gaming Headsets', 'Speakers'] },
  { name: 'Women\'s Clothing', subcategories: ['Dresses', 'Tops & Blouses', 'Pants & Jeans', 'Skirts', 'Outerwear', 'Activewear', 'Underwear'] },
  { name: 'Men\'s Clothing', subcategories: ['Shirts', 'T-Shirts', 'Pants & Jeans', 'Shorts', 'Suits', 'Activewear', 'Underwear'] },
  { name: 'Home & Kitchen', subcategories: ['Furniture', 'Appliances', 'Decor', 'Kitchen Tools', 'Bedding', 'Storage'] },
  { name: 'Sports & Fitness', subcategories: ['Exercise Equipment', 'Sportswear', 'Outdoor Gear', 'Supplements', 'Yoga & Pilates'] }
];

// ------------------------------------------------------------------
// NEW COMPONENT: MobileCategoryMenu
// ------------------------------------------------------------------
interface MobileCategoryMenuProps {
  categories: typeof categories;
  closeMenu: () => void; // Function to close the main navbar menu
}

const MobileCategoryMenu: React.FC<MobileCategoryMenuProps> = ({ categories, closeMenu }) => {
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    const toggleCategory = (categoryName: string) => {
        setOpenCategory(openCategory === categoryName ? null : categoryName);
    };

    return (
        <div className="space-y-1">
            <h3 className="font-semibold text-sm mb-2 text-primary pt-2 border-t border-glass-border">Categories</h3>
            {categories.map((category) => (
                <div key={category.name}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(category.name)}
                        className="w-full justify-start flex items-center hover:bg-hover-orange/10 hover:text-hover-orange"
                    >
                        <span className="flex-1 text-left">{category.name}</span>
                        {openCategory === category.name ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                        }
                    </Button>
                    
                    {/* Subcategories Dropdown */}
                    <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openCategory === category.name ? 'max-h-96 opacity-100 py-1' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="bg-background/70 rounded-md p-2 ml-4 space-y-1 border border-glass-border">
                            <Link 
                                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                                className="block text-sm font-medium px-2 py-1 text-primary hover:text-hover-orange/80 rounded-sm bg-background/50"
                                onClick={closeMenu}
                            >
                                View All {category.name}
                            </Link>
                            {category.subcategories.map((sub) => (
                                <Link
                                    key={sub}
                                    to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="block text-sm text-muted-foreground px-2 py-1 hover:text-[#ff902b] hover:bg-hover-orange/10 rounded-sm transition-colors"
                                    onClick={closeMenu}
                                >
                                    - {sub}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            
            <Separator className="bg-glass-border my-2" /> 

            {/* View All Categories Button */}
            <Link to="/categories" className="block pt-1" onClick={closeMenu}>
                <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full justify-center bg-gradient-primary hover:bg-[#ff902b]"
                >
                    Browse All Departments
                </Button>
            </Link>
        </div>
    );
};
// ------------------------------------------------------------------


export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false); 

  const navigate = useNavigate();
  const { setTheme, isDark } = useTheme();

  const { user, isLoggedIn, logout, isLoading } = useAuth();
  
  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchVisible(false); 
    }
  };
  
  const handleLogout = () => {
      logout(); 
      navigate('/login');
  };

  // SELL BUTTON LOGIC
  const SellButton = () => {
    if (isLoading) {
        return <Button variant="ghost" size="sm" disabled className="animate-pulse opacity-50"><Store className="w-4 h-4" /> <span className="text-sm">Sell</span></Button>
    }

    // Checking for 'both' role for comprehensive seller access
    const isSeller = isLoggedIn && (user?.role === 'seller' || user?.role === 'both');
    const linkPath = "/sell"; 
    const buttonText = isSeller ? "Sell" : "Sell";
    
    return (
        <Link to={linkPath}>
            <Button 
                variant="ghost" 
                size="sm" 
                className={`hover:bg-hover-orange/10 hover:text-hover-orange gap-1 ${isSeller ? 'font-semibold text-lime-500' : ''}`}
            >
                <Store className="w-4 h-4" />
                <span className="text-sm">{buttonText}</span>
            </Button>
        </Link>
    );
  };
  // ------------------------------------------------------------------

    if (isLoading) {
        return (
            <nav className="glass-nav px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-32 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
                <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
                    <div className="w-full h-8 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
            </nav>
        );
    }


  return (
    <TooltipProvider>
      <nav className="glass-nav px-4"> 
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        
          {/* =======================================================
             1. LEFT SECTION: Logo and Primary Navigation
             ======================================================= */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link to="/" className={`flex items-center space-x-2 transition-opacity ${isSearchVisible ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}>
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MarketPlace
              </span>
            </Link>
            
            {/* Primary Navigation Links (Home, Categories, Sell) - DESKTOP ONLY */}
            <div className="hidden lg:flex items-center space-x-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/">
                      <Button variant="ghost" size="sm" className="hover:bg-hover-orange/10 hover:text-hover-orange">Home</Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="glass-medium backdrop-blur-3xl border border-glass-border">
                    <p>Go to homepage and browse products</p>
                  </TooltipContent>
                </Tooltip>

                {/* Categories Dropdown (DESKTOP) */}
                <Tooltip>
                  <DropdownMenu>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-hover-orange/10 hover:text-hover-orange">
                          Categories <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                  <TooltipContent className="glass-medium backdrop-blur-3xl border border-glass-border">
                    <p>Browse products by category</p>
                  </TooltipContent>
                  <DropdownMenuContent className="glass-medium backdrop-blur-3xl border border-glass-border w-screen max-w-4xl">
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {categories.map((category) => (
                        <div key={category.name} className="space-y-2">
                          <div className="font-semibold text-sm px-2 py-1">
                            <Link to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#ff902b]">
                              {category.name}
                            </Link>
                          </div>
                          {category.subcategories.map((sub) => (
                            <div key={sub} className="text-sm text-muted-foreground px-2 py-1 hover:text-[#ff902b] hover:bg-hover-orange/10 rounded">
                              <Link to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${sub.toLowerCase().replace(/\s+/g, '-')}`}>
                                {sub}
                              </Link>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </DropdownMenuContent>
                  </DropdownMenu>
                </Tooltip>

                {/* DESKTOP SELL BUTTON */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-full flex items-center">
                       <SellButton />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="glass-medium backdrop-blur-3xl border border-glass-border">
                    <p>{(user?.role === 'seller' || user?.role === 'both') ? 'Go to your seller tools' : 'Sell your products on our platform'}</p>
                  </TooltipContent>
                </Tooltip>
            </div>
          </div>
          
          {/* =======================================================
             2. CENTER SECTION: Search Bar
             ======================================================= */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="input-glass pr-12"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="glass-primary"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                >
                  <Search className="w-20 h-4" />
                </Button>
                
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass-medium backdrop-blur-3xl border border-glass-border rounded-lg p-4 z-50">
                    <p className="text-sm text-muted-foreground mb-2">Popular searches</p>
                    <div className="space-y-2">
                      <button type="button" className="w-full text-left px-3 py-2 hover:bg-hover-orange/10 rounded-lg transition-colors">
                        <Search className="w-4 h-4 inline mr-2" />
                        Laptops
                      </button>
                      <button type="button" className="w-full text-left px-3 py-2 hover:bg-hover-orange/10 rounded-lg transition-colors">
                        <Search className="w-4 h-4 inline mr-2" />
                        Smartphones
                      </button>
                      <button type="button" className="w-full text-left px-3 py-2 hover:bg-hover-orange/10 rounded-lg transition-colors">
                        <Search className="w-4 h-4 inline mr-2" />
                        Headphones
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* =======================================================
             3. RIGHT SECTION: Icons and Dropdowns
             ======================================================= */}
          <div className="flex items-center space-x-2">
            
            {/* Desktop-only utility icons */}
            <div className="hidden lg:flex items-center space-x-2">
                <LanguageSelector />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setTheme(isDark ? 'light' : 'dark')}
                      className="hover:bg-hover-orange/10 hover:text-hover-orange"
                    >
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="glass-medium backdrop-blur-3xl border border-glass-border">
                    <p>Toggle {isDark ? 'light' : 'dark'} mode</p>
                  </TooltipContent>
                </Tooltip>
            </div>

            {/* Desktop-only secondary links (Wishlist, Orders, Chat) */}
            <div className="hidden lg:flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/wishlist">
                      <Button variant="ghost" size="sm" className="relative hover:bg-hover-orange/10 hover:text-hover-orange gap-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">Favourite</span>
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs badge-glass">3</Badge>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="glass-medium backdrop-blur-3xl border border-glass-border">
                    <p>View your saved products and favorites</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/orders">
                      <Button variant="ghost" size="sm" className="hover:bg-hover-orange/10 hover:text-hover-orange gap-1">
                        <Package className="w-4 h-4" />
                        <span className="text-sm">Orders</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="glass-medium backdrop-blur-3xl border border-glass-border">
                    <p>Track your orders and purchase history</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/messages">
                      <Button variant="ghost" size="sm" className="relative hover:bg-hover-orange/10 hover:text-hover-orange gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Chat</span>
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs badge-glass bg-destructive">2</Badge>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="glass-medium backdrop-blur-3xl border border-glass-border">
                    <p>Chat with sellers and view notifications</p>
                  </TooltipContent>
                </Tooltip>
            </div>
            
            {/* Cart & Profile Dropdown Group */}
            <div className="flex items-center space-x-2">
                {/* Cart Dropdown */}
                <Tooltip>
                  <DropdownMenu open={showCartDropdown} onOpenChange={setShowCartDropdown}>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="glass-primary" size="sm" className="relative hover:bg-hover-orange/10 hover:text-hover-orange gap-1">
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-sm hidden sm:inline">Cart</span>
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-destructive text-destructive-foreground">5</Badge>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="glass-medium backdrop-blur-3xl border border-glass-border">
                      <p>View your shopping cart and checkout</p>
                    </TooltipContent>
                    <DropdownMenuContent className="glass-medium backdrop-blur-3xl border border-glass-border p-0" align="end" sideOffset={5}>
                      <CartDropdown />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Tooltip>

                {/* Profile Dropdown (DESKTOP ONLY) */}
                <div className="hidden md:block">
                    <Tooltip>
                      <DropdownMenu 
                        open={showLoginDropdown} 
                        onOpenChange={setShowLoginDropdown}
                      >
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant={isLoggedIn ? "default" : "ghost"} 
                              size="sm" 
                              className="hover:bg-hover-orange/10 hover:text-hover-orange"
                            >
                              <User className="w-4 h-4" />
                              {isLoggedIn && <ChevronDown className="w-3 h-3 ml-1" />}
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent className="glass-medium backdrop-blur-3xl border border-glass-border">
                          <p>{isLoggedIn ? 'Access your profile' : 'Login, register, or access your profile'}</p>
                        </TooltipContent>
                        <DropdownMenuContent 
                          className="glass-medium backdrop-blur-3xl border border-glass-border p-0" 
                          align="end" 
                          sideOffset={5}
                        >
                          {/* INTEGRATED PROFILE DROPDOWN LOGIC */}
                          {isLoggedIn && user ? (
                              <div className="p-1 min-w-[220px]">
                                  {/* USER HEADER SECTION */}
                                  <div className="flex items-center space-x-3 p-3 mb-1 border-b border-glass-border">
                                      <Avatar className="h-10 w-10">
                                          <AvatarImage src={user.profileImageUrl} alt={`${user.name}'s profile`} />
                                          <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold">
                                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                          </AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col">
                                          <span className="font-semibold text-sm">{user.name}</span>
                                          <span className="text-xs text-muted-foreground">{user.email}</span> 
                                          <span className={`text-xs font-medium ${(user.role === 'seller' || user.role === 'both') ? 'text-lime-500' : 'text-blue-400'}`}>
                                              Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                          </span>
                                      </div>
                                  </div>
                                  
                                  {/* ACTION LINKS */}
                                  <DropdownMenuItem className="py-2 px-3 focus:bg-hover-orange/10 focus:text-hover-orange cursor-pointer" asChild>
                                      <Link to="/profile/settings">
                                          <User className="w-4 h-4 mr-2" />
                                          View Profile
                                      </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="py-2 px-3 focus:bg-hover-orange/10 focus:text-hover-orange cursor-pointer" asChild>
                                      <Link to="/settings">
                                          <SettingsIcon />
                                          Settings
                                      </Link>
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator className="bg-glass-border" />
                                  <DropdownMenuItem 
                                      onClick={handleLogout} 
                                      className="py-2 px-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                  >
                                      <LogoutIcon />
                                      Logout
                                  </DropdownMenuItem>
                              </div>
                          ) : (
                              <div className="p-2">
                                  <LoginRegisterDropdown />
                              </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Tooltip>
                </div>


                {/* Mobile Icons (Search & Menu) */}
                <div className="md:hidden flex items-center space-x-2">
                    {!isSearchVisible && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-hover-orange/10 hover:text-hover-orange"
                        onClick={() => {
                          setIsSearchVisible(true);
                          setIsMenuOpen(false); 
                        }}
                      >
                        <Search className="w-5 h-5" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-hover-orange/10 hover:text-hover-orange"
                      onClick={() => {
                        setIsMenuOpen(!isMenuOpen);
                        setIsSearchVisible(false); 
                      }}
                    >
                      {/* Toggling the icon based on menu state */}
                      {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>
          </div>


          {/* Mobile Search Bar */}
          <div className={`absolute top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-lg px-4 md:hidden transition-transform duration-300 ease-in-out z-40 ${isSearchVisible ? 'translate-y-0' : '-translate-y-full'}`}>
              <div className="flex items-center h-full">
                  <form onSubmit={handleSearch} className="flex flex-1">
                      <div className="relative flex-1">
                          <Input
                              type="text"
                              placeholder="Search..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="input-glass pr-12 h-10"
                              autoFocus={isSearchVisible}
                          />
                          <Button
                              type="submit"
                              size="sm"
                              variant="glass-primary"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                          >
                              <Search className="w-4 h-4" />
                          </Button>
                      </div>
                  </form>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 hover:bg-hover-orange/10 hover:text-hover-orange"
                      onClick={() => setIsSearchVisible(false)}
                  >
                      <X className="w-5 h-5" />
                  </Button>
              </div>
          </div>
          
        </div>
        
        {/* =======================================================
           4. MOBILE MENU (Full Screen Navigation)
           ======================================================= */}
        {isMenuOpen && (
          <div className="lg:hidden glass-medium backdrop-blur-[100px] border-t border-glass-border">
            <div className="px-4 py-3 space-y-2">
              
              {/* Theme Toggle & Language */}
              <div className="flex justify-between space-x-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    className="flex-1 justify-start hover:bg-hover-orange/10 hover:text-hover-orange"
                >
                    {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </Button>
                <LanguageSelector isMobile={true} />
              </div>
              
              {/* PRIMARY LINKS */}
              <Link to="/" className="block" onClick={closeMobileMenu}>
                <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-hover-orange/10 hover:text-hover-orange">Home</Button>
              </Link>
              
              {/* SELL BUTTON */}
              <Link to="/sell" className="block" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`w-full justify-start hover:bg-hover-orange/10 hover:text-hover-orange ${user?.role === 'seller' ? 'font-semibold text-lime-500' : ''}`}
                >
                    <Store className="w-4 h-4 mr-2" /> {user?.role === 'seller' ? 'Seller Dashboard' : 'Sell'}
                </Button>
              </Link>

              {/* SECONDARY LINKS */}
              <div className="pt-2 border-t border-glass-border space-y-2">
                <Link to="/wishlist" className="block" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-hover-orange/10 hover:text-hover-orange">
                    <Heart className="w-4 h-4 mr-2" /> Wishlist
                  </Button>
                </Link>
                <Link to="/orders" className="block" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-hover-orange/10 hover:text-hover-orange">
                    <Package className="w-4 h-4 mr-2" /> Orders
                  </Button>
                </Link>
                <Link to="/messages" className="block" onClick={closeMobileMenu}>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-hover-orange/10 hover:text-hover-orange">
                    <MessageCircle className="w-4 h-4 mr-2" /> Messages
                  </Button>
                </Link>
                <Link to="/cart" className="block" onClick={closeMobileMenu}>
                  <Button variant="glass-primary" size="sm" className="w-full justify-start hover:bg-hover-orange/10 hover:text-hover-orange">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Cart (5)
                  </Button>
                </Link>
              </div>

              {/* CATEGORIES SECTION (Now using the new collapsible component) */}
              <MobileCategoryMenu categories={categories} closeMenu={closeMobileMenu} />
              
              {/* PROFILE / LOGIN / LOGOUT */}
              <div className="pt-4 border-t border-glass-border space-y-2">
                {isLoggedIn && user ? (
                  <>
                      {/* User Avatar Header */}
                      <div className="flex items-center space-x-3 p-3 mb-1 border-b border-glass-border">
                          <Avatar className="h-10 w-10">
                              <AvatarImage src={user.profileImageUrl} alt={`${user.name}'s profile`} />
                              <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                              <span className="font-semibold text-sm">{user.name}</span>
                              <span className={`text-xs font-medium ${(user.role === 'seller' || user.role === 'both') ? 'text-lime-500' : 'text-blue-400'}`}>
                                  Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                          </div>
                      </div>
                      <Link to="/profile" className="block" onClick={closeMobileMenu}>
                          <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-hover-orange/10 hover:text-hover-orange">
                            <User className="w-4 h-4 mr-2" /> My Profile
                          </Button>
                      </Link>
                      <Link to="/settings" className="block" onClick={closeMobileMenu}>
                          <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-hover-orange/10 hover:text-hover-orange">
                            <SettingsIcon /> Settings
                          </Button>
                      </Link>
                      <Button onClick={() => { handleLogout(); closeMobileMenu(); }} variant="destructive" size="sm" className="w-full justify-start">
                          <LogoutIcon /> Logout
                      </Button>
                  </>
                ) : (
                  // Login/Register buttons when logged out
                  <LoginRegisterDropdown isMobile={true} closeMenu={closeMobileMenu} />
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </TooltipProvider>
  );
}