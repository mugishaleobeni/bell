import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

export function LoginRegisterDropdown() {
  return (
    <div className="min-w-[250px] p-4 space-y-3">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg mb-1">Welcome!</h3>
        <p className="text-sm text-muted-foreground">Sign in or create an account</p>
      </div>
      
      <Link to="/login" className="block">
        <Button variant="glass-primary" className="w-full justify-start gap-2">
          <LogIn className="w-4 h-4" />
          Login
        </Button>
      </Link>
      
      <Link to="/register" className="block">
        <Button variant="outline" className="w-full justify-start gap-2">
          <UserPlus className="w-4 h-4" />
          Register
        </Button>
      </Link>
      
      <div className="pt-3 border-t border-glass-border">
        <Link to="/checkout?guest=true" className="block">
          <Button variant="ghost" className="w-full text-sm">
            Continue as Guest
          </Button>
        </Link>
      </div>
    </div>
  );
}