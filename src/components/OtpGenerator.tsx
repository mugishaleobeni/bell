// src/components/OtpGenerator.tsx

import React, { useState, useEffect } from 'react';
import { Lock, DollarSign, RefreshCw, Copy, PhoneCall, CheckCircle } from 'lucide-react'; 
// NOTE: Assuming your actual UI components are imported from the correct path (e.g., @/components/ui)
import { 
    Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, 
} from '@/components/ui/card'; // Placeholder for actual UI components
import { useToast } from '@/hooks/use-toast'; 
import { styleMocks } from '../lib/ui-mocks'; 

// Define the API base URL
const API_BASE_URL = "http://127.0.0.1:5000";
const OTP_EXPIRATION_SECONDS = 60 * 15; // 15 minutes
const PAYMENT_PHONE = "0798009334";
const PAYMENT_AMOUNT = "RWF 2,000";

interface OtpPaymentGeneratorProps {
    productId: string; 
    setValidOtp: (otp: string) => void;
    currentOtp: string;
    triggerFormValidation: () => void;
}

export const OtpPaymentGenerator: React.FC<OtpPaymentGeneratorProps> = ({ productId, setValidOtp, currentOtp, triggerFormValidation }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0); 
    const [copySuccess, setCopySuccess] = useState('');
    // 🌟 NEW STATE: Tracks if the payment is visually acknowledged/mocked
    const [paymentAcknowledged, setPaymentAcknowledged] = useState(false); 
    
    // Helper to get the token for API calls
    const getAuthHeaders = () => {
        const token = localStorage.getItem("authToken"); 
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
    };

    // Handles 15-minute countdown and expiration
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && currentOtp !== '') {
            setValidOtp('');
            triggerFormValidation(); 
            toast({
                title: "OTP Expired",
                description: "The generated OTP has expired. Please generate a new one.",
                variant: "destructive"
            });
            // Reset acknowledged state so user sees payment instructions again
            setPaymentAcknowledged(false); 
        }
    }, [countdown, currentOtp, setValidOtp, triggerFormValidation, toast]);


    // Helper to format remaining time
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };


    // 🌟 PAYMENT STEP HANDLER 🌟
    const handleAcknowledgePayment = async () => {
        if (!productId) {
             toast({ title: "Error", description: "Product ID is missing.", variant: "destructive" });
             return;
        }

        // 1. Mock Payment Check: In a real system, you'd check a payment webhook here.
        // For now, we simulate success and move to the API generation step.
        setPaymentAcknowledged(true);
        
        // 2. Proceed to generate OTP from the backend
        handleGenerateOtpApiCall();
    }

    // 🌟 API CALL: POST /api/seller/product/<product_id>/generate-otp 🌟
    const handleGenerateOtpApiCall = async () => {
        setIsLoading(true);
        setValidOtp(''); 
        setCopySuccess('');

        // UX Delay
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        try {
            const response = await fetch(`${API_BASE_URL}/api/seller/product/${productId}/generate-otp`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });

            const data = await response.json();

            if (response.ok) {
                const newOtp = data.otp_code_for_testing;
                setValidOtp(newOtp); 
                setCountdown(OTP_EXPIRATION_SECONDS); 
                
                toast({
                    title: "OTP Generated",
                    description: data.msg || "The OTP is ready for confirmation.",
                });

            } else {
                 toast({
                    title: "OTP Failure",
                    description: data.msg || "Failed to generate OTP. Token expired or product error.",
                    variant: "destructive"
                });
                setPaymentAcknowledged(false); // Reset on API failure
            }

        } catch (error) {
            toast({
                title: "Network Error",
                description: "Could not connect to the API server.",
                variant: "destructive"
            });
             setPaymentAcknowledged(false); // Reset on network failure
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopyOtp = () => {
        if (currentOtp && navigator.clipboard) {
            navigator.clipboard.writeText(currentOtp);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    return (
        <Card className={(styleMocks['glass-medium'] || '') + " " + (styleMocks['border-glass-border'] || '') + " shadow-2xl sticky top-8 h-fit"}>
            <CardHeader className={"p-4 border-b " + (styleMocks['border-glass-border'] || '')}>
                <CardTitle className="text-xl flex items-center text-[#ff902b]">
                    <Lock className="w-4 h-4 mr-2" />
                    Listing Verification ({PAYMENT_AMOUNT})
                </CardTitle>
                <CardDescription className="text-sm">
                    {paymentAcknowledged || currentOtp ? "OTP is active. Provide the code below to the Admin." : "Complete payment to unlock your product OTP."}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
                
                {/* -------------------- STEP 1: PAYMENT INSTRUCTIONS -------------------- */}
                {!paymentAcknowledged && (
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-100/50 border border-yellow-300 rounded-lg space-y-2 text-center">
                            <p className="font-semibold text-lg text-yellow-800">Payment Required</p>
                            <p className="text-sm">Please send **{PAYMENT_AMOUNT}** via MoMo/Mobile Money to the number below:</p>
                            <div className="flex items-center justify-center font-extrabold text-2xl text-primary p-2 bg-yellow-50 rounded-md">
                                <PhoneCall className="w-5 h-5 mr-3" />
                                {PAYMENT_PHONE}
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">After paying, click the button below to generate your OTP.</p>
                        </div>

                        <Button 
                            onClick={handleAcknowledgePayment} 
                            disabled={isLoading}
                            className={`w-full text-md py-6 transition-all bg-green-600 hover:bg-green-700 text-white`}
                        >
                            {isLoading ? (
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle className="w-5 h-5 mr-2" />
                            )}
                            {isLoading ? 'Generating OTP...' : `I Have Paid ${PAYMENT_AMOUNT} & Get OTP`}
                        </Button>
                    </div>
                )}
                
                {/* -------------------- STEP 2: OTP DISPLAY & TIMER -------------------- */}
                {(paymentAcknowledged || currentOtp) && (
                    <div className={"text-center p-3 rounded-lg border border-dashed " + (styleMocks['border-glass-border'] || '') + " space-y-2"}>
                        <p className="text-sm font-medium text-muted-foreground">Generated OTP (Single Use):</p>
                        {currentOtp ? (
                            <div className='flex items-center justify-center space-x-2'>
                                <Badge className="text-lg bg-yellow-500 text-black px-4 py-1">
                                    {currentOtp}
                                </Badge>
                                <span className="text-sm font-bold text-red-500">({formatTime(countdown)} remaining)</span>
                                
                                <Button 
                                    onClick={handleCopyOtp} 
                                    variant="outline" 
                                    className={"h-8 text-xs px-2 " + (styleMocks['variant-outline'] || '')}
                                >
                                    <Copy className="w-3 h-3 mr-1" />
                                    {copySuccess || 'Copy OTP'}
                                </Button>
                            </div>
                        ) : (
                            <p className={`text-sm font-semibold text-gray-500`}>
                                OTP has expired. Click the 'I Have Paid' button to generate a new one.
                            </p>
                        )}
                    </div>
                )}

                <div className="text-xs text-center text-muted-foreground italic">
                    The OTP is **valid for 15 minutes** and **expires after one successful submission by the Admin**.
                </div>
            </CardContent>
        </Card>
    );
};