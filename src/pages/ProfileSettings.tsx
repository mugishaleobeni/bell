import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; 
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User, Store, Trash2, Camera, Check } from 'lucide-react'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://beltrandsmarketbackend.onrender.com/api';

// --- Placeholder for your business categories ---
const BUSINESS_CATEGORIES = ['Electronics', 'Fashion', 'Home Goods', 'Sports', 'Books', 'Other'];

// --- Helper component for the Profile Image (Modified to clear toast) ---
const ProfileImageInput: React.FC<{ imageUrl: string | undefined, setImageUrl: (url: string) => void, disabled: boolean, onInputChange: (url: string) => void }> = ({ imageUrl, setImageUrl, disabled, onInputChange }) => (
    <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#ff902b]/50 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            {imageUrl ? (
                <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'placeholder-user-icon-url')} />
            ) : (
                <User className="w-10 h-10 text-muted-foreground" />
            )}
        </div>
        <div className="flex-1">
            <Label htmlFor="profileImageUrl" className="text-sm font-medium">Profile Image URL</Label>
            <Input
                id="profileImageUrl"
                type="url"
                value={imageUrl || ''}
                onChange={(e) => {
                    setImageUrl(e.target.value);
                    onInputChange(e.target.value);
                }}
                placeholder="Paste public image URL (e.g., from an S3 bucket)"
                disabled={disabled}
                className="mt-1"
            />
        </div>
    </div>
);


const ProfileSettings: React.FC = () => {
    const { user, isLoggedIn, isLoading, getAccessToken, login, logout } = useAuth(); 
    
    // --- State initialization ---
    const [profileData, setProfileData] = useState({
        profileImageUrl: user?.profileImageUrl || '',
        businessName: user?.businessName || '', 
        businessCategory: user?.businessCategory || '', 
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeStatus, setUpgradeStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');
    
    // 🚨 NEW STATE for toast/message
    const [showUpgradeToast, setShowUpgradeToast] = useState(false);


    // Handle authentication checks first
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    // Safety check: Redirect if not logged in
    if (!isLoggedIn || !user) {
        return <p className="text-center p-8">Please log in to view settings.</p>;
    }

    const userRole = user.role.toLowerCase(); 
    const isSellerOrBoth = userRole === 'seller' || userRole === 'both';
    const isBuyerOnly = userRole === 'buyer';
    const canUpgrade = isBuyerOnly;

    // Helper to clear toast
    const handleProfileInputChange = (url: string) => {
        setProfileData(p => ({ ...p, profileImageUrl: url }));
        // Only clear the toast if the user interacts with the non-seller fields
        setShowUpgradeToast(false); 
    };

    // --- Profile Update Handler (PATCH) ---
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveStatus('idle');

        // Prevent update if buyer tries to save seller-specific fields and they are empty
        if (isBuyerOnly && (profileData.businessName || profileData.businessCategory)) {
             // If a buyer somehow has data in these fields (e.g., from a previous seller role) 
             // and tries to update them, let the PATCH request handle the logic. 
             // However, the inputs are now disabled, so this check is mainly for robust handling.
        }

        try {
            const token = getAccessToken();
            
            if (!token) {
                console.error("AuthContext Error: Access token is missing or expired.");
                setSaveStatus('error');
                logout(); 
                return;
            }

            const payload = {
                profileImageUrl: profileData.profileImageUrl,
                businessName: profileData.businessName,
                businessCategory: profileData.businessCategory,
            };

            const response = await fetch(`${API_BASE_URL}/user/me`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await login(token); 
                setSaveStatus('success');
            } else {
                setSaveStatus('error');
                const errorText = await response.text();
                console.error("Profile update failed:", errorText);
                if (response.status === 401) logout();
            }

        } catch (error) {
            setSaveStatus('error');
            console.error("Network error during profile update:", error);
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };
    
    // --- API Function to Upgrade Role (Unchanged) ---
    const handleUpgradeAccount = async () => {
        if (!canUpgrade) return;

        setIsUpgrading(true);
        setUpgradeStatus('idle');

        try {
            const token = getAccessToken();
            if (!token) { logout(); return; }
            
            const response = await fetch(`${API_BASE_URL}/user/me`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: 'seller' }),
            });

            if (response.ok) {
                // Clear the toast on successful upgrade
                setShowUpgradeToast(false); 
                await login(token); 
                setUpgradeStatus('success');
            } else {
                setUpgradeStatus('error');
                console.error("Upgrade failed:", await response.text());
                if (response.status === 401) logout();
            }

        } catch (error) {
            setUpgradeStatus('error');
            console.error("Network error during upgrade:", error);
        } finally {
            setIsUpgrading(false);
        }
    };

    // --- API Function to Delete Account (Unchanged) ---
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "WARNING: This action is permanent and cannot be undone. Are you sure you want to delete your account?"
        );
        
        if (!confirmDelete) return;

        setIsDeleting(true);
        setDeleteStatus('idle');

        try {
            const token = getAccessToken();
            if (!token) { logout(); return; }
            
            const response = await fetch(`${API_BASE_URL}/user/me`, {
                method: 'DELETE', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok || response.status === 204) {
                setDeleteStatus('success');
                logout(); 
            } else {
                setDeleteStatus('error');
                console.error("Deletion failed:", await response.text());
            }

        } catch (error) {
            setDeleteStatus('error');
            console.error("Network error during deletion:", error);
        } finally {
            setIsDeleting(false);
        }
    };


    return (
        <div className="container max-w-4xl py-12">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* 1. Account Details & Business Form Card */}
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl">Profile & Business Details</CardTitle>
                        <Camera className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            
                            {/* Profile Image Input */}
                            <ProfileImageInput 
                                imageUrl={profileData.profileImageUrl}
                                setImageUrl={(url) => setProfileData(p => ({ ...p, profileImageUrl: url }))}
                                disabled={isSaving}
                                // 🚨 FIX: Add handler to clear toast
                                onInputChange={handleProfileInputChange} 
                            />
                            
                            {/* Static Information */}
                            <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p>
                                    <strong>Current Role:</strong> 
                                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                        userRole === 'buyer' ? 'bg-blue-100 text-blue-700' : 
                                        userRole === 'seller' ? 'bg-green-100 text-green-700' : 
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </p>
                            </div>
                            
                            {/* Business Details (Visible to all, but required for seller role) */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                    <Store className="w-4 h-4 mr-2 text-[#ff902b]"/>
                                    Business Information
                                </h3>
                                
                                {/* 🚨 NEW: Toast/Message for Buyer */}
                                {isBuyerOnly && (
                                    <div className={`p-4 rounded-md transition-all duration-300 ${
                                        showUpgradeToast 
                                            ? 'bg-yellow-100 border border-yellow-300 text-yellow-700 opacity-100' 
                                            : 'opacity-0 h-0 p-0 overflow-hidden'
                                    }`} role="alert">
                                        <p className="font-bold">Seller Upgrade Required</p>
                                        <p>You must upgrade your account to Seller status to manage business details.</p>
                                    </div>
                                )}
                                
                                {/* Business Name */}
                                <div>
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <Input
                                        id="businessName"
                                        value={profileData.businessName}
                                        onChange={(e) => setProfileData(p => ({ ...p, businessName: e.target.value }))}
                                        placeholder="E.g., Tech World Electronics"
                                        required={isSellerOrBoth}
                                        // 🚨 FIX: Disable for buyer only
                                        disabled={isSaving || isBuyerOnly} 
                                        // 🚨 FIX: Show toast on interaction
                                        onClick={() => isBuyerOnly && setShowUpgradeToast(true)}
                                    />
                                    {isSellerOrBoth && !profileData.businessName && <p className="text-xs text-red-500 mt-1">Required for sellers.</p>}
                                </div>
                                
                                {/* Business Category/Description */}
                                <div>
                                    <Label htmlFor="businessCategory">Business Category (What you sell)</Label>
                                    <select
                                        id="businessCategory"
                                        value={profileData.businessCategory}
                                        onChange={(e) => setProfileData(p => ({ ...p, businessCategory: e.target.value }))}
                                        required={isSellerOrBoth}
                                        // 🚨 FIX: Disable for buyer only
                                        disabled={isSaving || isBuyerOnly} 
                                        // 🚨 FIX: Show toast on interaction
                                        onClick={() => isBuyerOnly && setShowUpgradeToast(true)}
                                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff902b]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select a category</option>
                                        {BUSINESS_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {isSellerOrBoth && !profileData.businessCategory && <p className="text-xs text-red-500 mt-1">Required for sellers.</p>}
                                </div>
                            </div>
                            
                            {/* Submit Button */}
                            <div className="flex items-center justify-between pt-4">
                                <Button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-[#ff902b] hover:bg-[#ff902b]/90 text-white"
                                >
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                                {saveStatus === 'success' && (
                                    <span className="text-sm text-green-600 flex items-center">
                                        <Check className="w-4 h-4 mr-1"/> Saved!
                                    </span>
                                )}
                                {saveStatus === 'error' && (
                                    <span className="text-sm text-red-500">
                                        Save failed.
                                    </span>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
                
                {/* 2. Account Upgrade Card (Unchanged) */}
                <Card className="md:col-span-1 border-2 border-dashed border-[#ff902b]/50">
                    <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                            <Store className="h-5 w-5 mr-2 text-[#ff902b]" />
                            Seller Access
                        </CardTitle>
                        <CardDescription>
                            {isBuyerOnly 
                                ? "Unlock the Seller Central dashboard and list products."
                                : "You already have seller permissions."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isBuyerOnly ? (
                            <>
                                <Button 
                                    onClick={handleUpgradeAccount}
                                    disabled={isUpgrading || upgradeStatus === 'success'}
                                    className="w-full bg-[#ff902b] hover:bg-[#ff902b]/90 text-white"
                                >
                                    {isUpgrading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : upgradeStatus === 'success' ? (
                                        'Account Upgraded!'
                                    ) : (
                                        'Upgrade to Seller'
                                    )}
                                </Button>
                                {upgradeStatus === 'error' && (
                                    <p className="text-sm text-red-500 mt-2">Upgrade failed. Please try again.</p>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-green-600 font-semibold">
                                Full Seller access is currently active.
                            </p>
                        )}
                    </CardContent>
                </Card>
                
                {/* 3. Account Deletion Card (Unchanged) */}
                <Card className="md:col-span-3 border-2 border-red-500/50 bg-red-50 dark:bg-red-950">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl text-red-700 dark:text-red-400">
                            <Trash2 className="h-6 w-6 mr-2" />
                            Danger Zone: Delete Account
                        </CardTitle>
                        <CardDescription className="text-red-600 dark:text-red-300">
                            Permanently close your account and remove all your data. This action is irreversible.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || deleteStatus === 'success'}
                            className="w-auto bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : deleteStatus === 'success' ? (
                                'Account Deleted!'
                            ) : (
                                'Delete My Account'
                            )}
                        </Button>
                        {deleteStatus === 'error' && (
                            <p className="text-sm text-red-500 mt-2">Deletion failed. Check console for details.</p>
                        )}
                        {deleteStatus === 'success' && (
                            <p className="text-sm text-green-600 mt-2">Account deleted successfully. Logging out...</p>
                        )}
                    </CardContent>
                </Card>

            </div>
            
        </div>
    );
};

export default ProfileSettings;