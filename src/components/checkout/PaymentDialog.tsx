import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  paymentMethod: 'mtn' | 'airtel' | 'card' | 'wallet';
  onSuccess: () => void;
}

export default function PaymentDialog({
  open,
  onOpenChange,
  amount,
  paymentMethod,
  onSuccess
}: PaymentDialogProps) {
  const [step, setStep] = useState<'input' | 'processing' | 'confirm' | 'success'>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (!open) {
      setStep('input');
      setPhoneNumber('');
      setOtp('');
    }
  }, [open]);

  const handleInitiatePayment = () => {
    setStep('processing');
    // Simulate payment initiation
    setTimeout(() => {
      setStep('confirm');
    }, 2000);
  };

  const handleConfirmPayment = () => {
    setStep('processing');
    // Simulate OTP verification
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
      }, 2000);
    }, 1500);
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'mtn':
        return 'MTN Mobile Money';
      case 'airtel':
        return 'Airtel Money';
      case 'card':
        return 'Card Payment';
      case 'wallet':
        return 'Digital Wallet';
      default:
        return 'Payment';
    }
  };

  const getPaymentMethodColor = () => {
    switch (paymentMethod) {
      case 'mtn':
        return '#FFCB05';
      case 'airtel':
        return '#ED1C24';
      default:
        return '#ff902b';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-glass-border max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: getPaymentMethodColor() }}
            >
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            {getPaymentMethodName()}
          </DialogTitle>
          <DialogDescription>
            Secure payment processing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Display */}
          <div className="glass-medium p-6 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Amount to Pay</p>
            <p className="text-4xl font-bold text-[#ff902b]">
              {amount.toLocaleString()} RWF
            </p>
          </div>

          {step === 'input' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-phone">
                  {paymentMethod === 'mtn' ? 'MTN' : 'Airtel'} Phone Number
                </Label>
                <Input
                  id="payment-phone"
                  placeholder="+250 78X XXX XXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-glass"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the number you'll use to approve the payment
                </p>
              </div>

              {/* Security Notice */}
              <div className="glass-medium p-4 rounded-lg flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#ff902b] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Secure Transaction</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Your payment is encrypted and secure</li>
                    <li>• You'll receive an OTP to confirm</li>
                    <li>• Funds are protected by escrow service</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={handleInitiatePayment}
                disabled={!phoneNumber}
                className="w-full"
                variant="glass-primary"
                size="lg"
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="w-16 h-16 animate-spin text-[#ff902b] mx-auto" />
              <div>
                <p className="font-semibold text-lg">Processing Payment...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please wait while we process your transaction
                </p>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="glass-medium p-4 rounded-lg text-center">
                <AlertCircle className="w-12 h-12 text-[#ff902b] mx-auto mb-3" />
                <p className="font-semibold">Check Your Phone</p>
                <p className="text-sm text-muted-foreground mt-1">
                  An OTP has been sent to {phoneNumber}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP Code</Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input-glass text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleConfirmPayment}
                disabled={otp.length !== 6}
                className="w-full"
                variant="glass-primary"
                size="lg"
              >
                Confirm Payment
              </Button>

              <Button
                onClick={() => setStep('input')}
                variant="outline"
                className="w-full"
              >
                Change Number
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <p className="font-bold text-xl text-green-500">Payment Successful!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your order has been placed successfully
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
