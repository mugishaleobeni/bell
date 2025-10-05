import React, { useState } from 'react';
import { MapPin, CreditCard, ShieldCheck, CheckCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import PaymentDialog from '@/components/checkout/PaymentDialog';

const cartItems = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 45000,
    quantity: 1,
    image: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 85000,
    quantity: 2,
    image: '/placeholder.svg'
  }
];

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'airtel' | 'card' | 'wallet'>('mtn');
  const [useEscrow, setUseEscrow] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5000;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly."
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Checkout Option */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Checkbox 
                  id="guest" 
                  checked={guestCheckout}
                  onCheckedChange={(checked) => setGuestCheckout(checked as boolean)}
                />
                <Label htmlFor="guest" className="cursor-pointer">
                  Continue as guest (no account required)
                </Label>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#ff902b]" />
                Delivery Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" className="input-glass" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+250 700 000 000" className="input-glass" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="KG 123 St" className="input-glass" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Kigali" className="input-glass" />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input id="district" placeholder="Gasabo" className="input-glass" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#ff902b]" />
                Payment Method
              </h2>

              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <div className="space-y-3">
                  {/* MTN Mobile Money */}
                  <div className={`flex items-center space-x-2 glass-medium p-4 rounded-lg cursor-pointer border-2 smooth-transition ${
                    paymentMethod === 'mtn' ? 'border-[#FFCB05] bg-[#FFCB05]/10' : 'border-transparent hover:border-[#ff902b]'
                  }`}>
                    <RadioGroupItem value="mtn" id="mtn" />
                    <Label htmlFor="mtn" className="flex-1 cursor-pointer flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFCB05] flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <p className="font-semibold">MTN Mobile Money</p>
                        <p className="text-xs text-muted-foreground">Pay with MTN MoMo</p>
                      </div>
                    </Label>
                  </div>

                  {/* Airtel Money */}
                  <div className={`flex items-center space-x-2 glass-medium p-4 rounded-lg cursor-pointer border-2 smooth-transition ${
                    paymentMethod === 'airtel' ? 'border-[#ED1C24] bg-[#ED1C24]/10' : 'border-transparent hover:border-[#ff902b]'
                  }`}>
                    <RadioGroupItem value="airtel" id="airtel" />
                    <Label htmlFor="airtel" className="flex-1 cursor-pointer flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#ED1C24] flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Airtel Money</p>
                        <p className="text-xs text-muted-foreground">Pay with Airtel Money</p>
                      </div>
                    </Label>
                  </div>

                  {/* Credit/Debit Card */}
                  <div className={`flex items-center space-x-2 glass-medium p-4 rounded-lg cursor-pointer border-2 smooth-transition ${
                    paymentMethod === 'card' ? 'border-[#ff902b] bg-[#ff902b]/10' : 'border-transparent hover:border-[#ff902b]'
                  }`}>
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Credit/Debit Card</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard accepted</p>
                      </div>
                    </Label>
                  </div>

                  {/* Digital Wallet */}
                  <div className={`flex items-center space-x-2 glass-medium p-4 rounded-lg cursor-pointer border-2 smooth-transition ${
                    paymentMethod === 'wallet' ? 'border-[#ff902b] bg-[#ff902b]/10' : 'border-transparent hover:border-[#ff902b]'
                  }`}>
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex-1 cursor-pointer flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Digital Wallet</p>
                        <p className="text-xs text-muted-foreground">PayPal, Apple Pay, Google Pay</p>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {/* Payment Amount Display */}
              <div className="mt-4 glass-medium p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">You will pay</span>
                  <span className="text-2xl font-bold text-[#ff902b]">
                    {(isSubscription ? total - (subtotal * 0.1) : total).toLocaleString()} RWF
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Secure payment processing with bank-level encryption
                </p>
              </div>

            </div>

            {/* Additional Options */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="escrow" 
                  checked={useEscrow}
                  onCheckedChange={(checked) => setUseEscrow(checked as boolean)}
                />
                <Label htmlFor="escrow" className="cursor-pointer flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ff902b]" />
                  Use Escrow Protection (Payment held until delivery confirmed)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox 
                  id="subscription" 
                  checked={isSubscription}
                  onCheckedChange={(checked) => setIsSubscription(checked as boolean)}
                />
                <Label htmlFor="subscription" className="cursor-pointer">
                  Subscribe for recurring orders (10% discount)
                </Label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-glass-border">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-[#ff902b]">
                        {item.price.toLocaleString()} RWF
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{subtotal.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">{shipping.toLocaleString()} RWF</span>
                </div>
                {isSubscription && (
                  <div className="flex justify-between text-green-600">
                    <span>Subscription Discount (10%)</span>
                    <span>-{(subtotal * 0.1).toLocaleString()} RWF</span>
                  </div>
                )}
                <div className="border-t border-glass-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-xl font-bold text-[#ff902b]">
                      {(isSubscription ? total - (subtotal * 0.1) : total).toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                variant="glass-primary" 
                className="w-full" 
                size="lg"
                onClick={handlePlaceOrder}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Place Order
              </Button>

              {useEscrow && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Payment will be held securely until you confirm delivery
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        amount={isSubscription ? total - (subtotal * 0.1) : total}
        paymentMethod={paymentMethod}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
