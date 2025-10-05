import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Briefcase, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CardSwap, { Card } from '@/components/ui/card-swap';
import { API_BASE_URL } from '@/components/ui/input-otp'; 
// --------------------------------------------------------------------------------

// Blurred Background Component (Unchanged)
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


export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    country: '',
    role: '' // 'Buyer', 'Seller', or 'Both'
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // -------------------------------------------------------------------
  // HANDLER FOR EMAIL/PASSWORD REGISTRATION (UNMODIFIED LOGIC)
  // -------------------------------------------------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role) {
        toast({
            title: "Error",
            description: "Please select a role (Buyer, Seller, or Both) to continue.",
            variant: "destructive"
        });
        return;
    }
    
    setIsLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                full_name: formData.fullName,
                phone: formData.phone,
                country: formData.country,
                role: formData.role
            }),
        });

        const data = await response.json();

        if (response.ok) {
            toast({
                title: "Registration Successful 🎉",
                description: `Welcome! Please check your email to verify your account.`,
            });
            navigate('/login'); 
        } else {
            toast({
                title: "Registration Failed",
                description: data.msg || "An unexpected error occurred. Please try again.",
                variant: "destructive"
            });
        }
    } catch (error) {
        console.error('Registration API Error:', error);
        toast({
            title: "Network Error",
            description: "Could not connect to the server. Please check your connection or API URL.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  // Helper function for input changes (Unchanged)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };
  
  // New handler for role selection via Card (Unchanged)
  const handleRoleSelect = (role: string) => {
      setFormData({...formData, role});
  }

const roleCards = [
      { role: 'Buyer', icon: ShoppingCart, title: 'I want to Buy', description: 'Access products from various sellers.' },
      { role: 'Seller', icon: Briefcase, title: 'I want to Sell', description: 'List and manage your own products.' },
      { role: 'Both', icon: UserPlus, title: 'Both Buy & Sell', description: 'Enjoy the full marketplace experience.' },
];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {/* Left Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            {/* Logo/Branding (Unchanged) */}
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MarketPlace
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-6">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join our marketplace community today</p>
          </div>

          <form 
            onSubmit={handleRegister} 
            className="space-y-6 glass-card p-8"
          >
            {/* Input fields (Unchanged) */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className="input-glass"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="input-glass"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+250 XXX XXX XXX"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-glass"
                required
              />
              <p className="text-xs text-muted-foreground">OTP verification will be sent</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="input-glass"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="glass-medium backdrop-blur-xl border border-glass-border">
                  <SelectItem value="rwanda">🇷🇼 Rwanda</SelectItem>
                  <SelectItem value="uganda">🇺🇬 Uganda</SelectItem>
                  <SelectItem value="kenya">🇰🇪 Kenya</SelectItem>
                  <SelectItem value="tanzania">🇹🇿 Tanzania</SelectItem>
                  <SelectItem value="burundi">🇧🇮 Burundi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Role Selection (Unchanged) */}
            <div className="space-y-2">
              <Label className="block mb-4">Select Your Role</Label>
              <div className="flex justify-between space-x-3">
                {roleCards.map(({ role, icon: Icon, title, description }) => (
                    <div 
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 
                                    ${formData.role === role 
                                        ? 'border-[#ff902b] bg-background/50 shadow-lg' 
                                        : 'border-transparent bg-background/30 hover:border-border'
                                    }`}
                    >
                        <Icon className={`w-6 h-6 mb-2 ${formData.role === role ? 'text-[#ff902b]' : 'text-muted-foreground'}`} />
                        <h4 className="font-semibold text-sm">{title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                ))}
              </div>
            </div>

            {/* Submit Button - Disabled when loading */}
            <Button 
                type="submit" 
                className="w-full" 
                variant="glass-primary"
                disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* 🚨 REMOVED: Social Sign-up Divider and Google Button */}
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-[#ff902b] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Slider (Unchanged) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-background/50 overflow-hidden">
        
        <BlurredBackgroundCircles /> 

        <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl z-20" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-30">
            {/* ... (Slider Content is unchanged) ... */}
            <div className="text-white text-center space-y-4 px-12 z-30 mb-auto mt-20">
                <h2 className="text-4xl font-bold ">Why Choose Our Marketplace?</h2>
                <p className="text-lg opacity-90">Discover amazing products from trusted sellers worldwide</p>
                <p className="text-lg opacity-90">publish your product over worldwide</p>

            </div>

            <CardSwap
              width={400}
              height={500}
              cardDistance={50}
              verticalDistance={60}
              delay={4000}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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