import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Sun, Moon, Briefcase, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CardSwap, { Card } from '@/components/ui/card-swap';
import { useTheme } from '@/contexts/ThemeContext';
// 🌟 NEW: Import useAuth hook
import { useAuth } from '@/contexts/AuthContext'; 

// Assuming this path is correct for VITE_API_URL
// NOTE: Make sure API_BASE_URL is correctly defined in the imported file
import { API_BASE_URL } from '@/components/ui/input-otp'; 

// Blurred Background Component for the main right panel (Unchanged)
const BlurredBackgroundCircles = () => (
    <div className="absolute inset-0">
        {/* Layer 1: Large orange blob (bottom left) */}
        <div 
            className="absolute w-[800px] h-[800px] bg-gradient-to-br from-[#ff902b] to-[#ff6b00] rounded-full 
                       bottom-0 left-0 transform translate-x-1/2 translate-y-1/2 opacity-60 filter blur-3xl 
                       animate-pulse"
            style={{ animationDuration: '8s' }}
        />
        {/* Layer 2: Medium blue blob (top right) */}
        <div 
            className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#4169E1] to-[#8A2BE2] rounded-full 
                       top-0 right-0 transform -translate-x-1/2 -translate-y-1/2 opacity-60 filter blur-3xl 
                       animate-pulse"
            style={{ animationDuration: '12s' }}
        />
    </div>
);


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTheme, isDark } = useTheme(); 
  // 🌟 NEW: Get the login function from the Auth Context
  const { login } = useAuth();

  // -------------------------------------------------------------------
  // API INTEGRATION FOR LOGIN
  // -------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Success! The token should be in data.token
            const authToken = data.token;

            // 🌟 CRITICAL FIX: Use the context's login function
            // This function stores the token and immediately fetches the user profile.
            await login(authToken); 

            toast({
                title: "Login Successful 🎉",
                description: data.message || "Welcome back to MarketPlace!",
            });
            // Redirect to the homepage or dashboard
            navigate('/'); 
        } else {
            // Failure (e.g., 400 Bad Request or 401 Unauthorized from backend)
            toast({
                title: "Login Failed",
                description: data.msg || "Invalid credentials. Please check your email and password.",
                variant: "destructive"
            });
        }
    } catch (error) {
        console.error('Login API Error:', error);
        toast({
            title: "Network Error",
            description: "Could not connect to the server. Please check your internet connection.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      
      {/* Theme Toggle Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleThemeToggle}
        className="absolute top-4 right-4 z-50 hover:bg-hover-orange/10 hover:text-hover-orange"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      {/* Left Side - Login Form (rest of the component is unchanged) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MarketPlace
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-6">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 glass-card p-8">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#ff902b] hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button 
                type="submit" 
                className="w-full" 
                variant="glass-primary"
                disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            {/* 🚨 REMOVED: Social Sign-up Divider and Google Button */}

            <p className="text-center text-sm text-muted-foreground mt-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#ff902b] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Slider with Blurred Glass Background (Unchanged) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-background/50 overflow-hidden">
        
        {/* 1. VIBRANT, CHANGING BACKGROUND LAYER (BEHIND BLUR) */}
        <BlurredBackgroundCircles /> 

        {/* 2. GLASS BLUR OVERLAY LAYER (IN FRONT OF COLORS) */}
        <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl z-20" />
        
        {/* 3. CONTENT (TEXT & SLIDER) - Must be positioned above the blur layer (z-30) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-30">
            <div className="text-white text-center space-y-4 px-12 z-30 mb-auto mt-20">
                <h2 className="text-4xl font-bold ">Why Choose Our Marketplace?</h2>
                <p className="text-lg opacity-90">Discover amazing products from trusted sellers worldwide</p>
                <p className="text-lg opacity-90">Join seller in world to publish your product</p>

            </div>

        
            <CardSwap
              width={400}
              height={500}
              cardDistance={50}
              verticalDistance={60}
              delay={400}
              pauseOnHover={true}
            >
              {/* Card 1: Secure Shopping */}
              <Card className="glass-card-light backdrop-blur-md p-8 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                    <ShoppingCart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Secure Shopping</h3>
                  <p className="text-muted-foreground">Your transactions are protected with our secure payment system</p>
                </div>
              </Card>
              
              {/* Card 2: Fast Delivery */}
              <Card className="glass-card-light backdrop-blur-md p-8 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Fast Delivery</h3>
                  <p className="text-muted-foreground">Get your products delivered quickly to your doorstep</p>
                </div>
              </Card>

              {/* Card 3: Best Prices */}
              <Card className="glass-card-light backdrop-blur-md p-8 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Best Prices</h3>
                  <p className="text-muted-foreground">Compare prices and find the best deals on quality products</p>
                </div>
              </Card>
              
              {/* Card 4: Business Journey */}
              <Card className="glass-card-light backdrop-blur-md p-8 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Briefcase className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Start Selling</h3>
                  <p className="text-muted-foreground">Your business journey begins here.</p>
                </div>
              </Card>
              
              {/* Card 5: Join & Own */}
              <Card className="glass-card-light backdrop-blur-md p-8 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                    <UserPlus className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Be a Member</h3>
                  <p className="text-muted-foreground">Don’t just browse — join and make it yours.</p>
                </div>
              </Card>

            </CardSwap>
        </div>

      </div>
    </div>
  );
}