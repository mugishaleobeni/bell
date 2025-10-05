import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MarketPlace
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted e-commerce marketplace for quality products at unbeatable prices. 
              Discover millions of products from verified sellers worldwide.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-primary transition-colors">Press Center</Link></li>
              <li><Link to="/investor-relations" className="hover:text-primary transition-colors">Investor Relations</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/track-order" className="hover:text-primary transition-colors">Track Your Order</Link></li>
              <li><Link to="/dispute-resolution" className="hover:text-primary transition-colors">Dispute Resolution</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers, free giveaways, and exclusive deals.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="input-glass flex-1"
              />
              <Button variant="default" size="sm">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
              <Link to="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 MarketPlace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}