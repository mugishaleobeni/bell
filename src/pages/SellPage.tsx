import React, { useState, useEffect, useCallback } from 'react';
import { Package, DollarSign, CheckCircle, Cpu, List, X, Loader2, Send } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

// --- Imports from your project ---
import { 
    SellerProduct, 
    NewProductFormValues, 
    EditProductFormValues 
} from '@/utils/sellerDashboard.utils';

import { useAuth } from '@/contexts/AuthContext'; 
import { useToast } from '@/components/ui/use-toast'; 

// Dashboard Components
import { ProductPostForm } from '@/components/SellerComponents/forms/ProductPostForm';
import { ProductEditForm } from '@/components/SellerComponents/forms/ProductEditForm';
import { ProductManagementCard } from '@/components/SellerComponents/ProductManagementCard';
import { StatCard } from '@/components/SellerComponents/StatCard';

// --- CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://beltrandsmarketbackend.onrender.com/api';


export const SellPage: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const { 
        isLoggedIn, 
        user, 
        isLoading: isAuthLoading, 
        getAccessToken 
    } = useAuth(); 

    const [products, setProducts] = useState<SellerProduct[] | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(false); 
    const [showListings, setShowListings] = useState(true);
    const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
    
    // Helper to reset the products state and trigger a reload via useEffect
    const reloadProducts = useCallback(() => setProducts(null), []);

    // --- Authorization Logic (omitted for brevity) ---
    const userRole = user?.role?.toLowerCase(); 
    const isSeller = isLoggedIn && (userRole === 'seller' || userRole === 'both'); 
    const isBuyerOnly = isLoggedIn && userRole === 'buyer'; 
    const isAnonymous = !isLoggedIn; 

    let redirectPath: string | null = null;
    if (isAnonymous) {
        redirectPath = '/login'; 
    }

    // Helper to map MongoDB '_id' to frontend 'id'
    const mapProduct = (product: any): SellerProduct => ({
        ...product,
        id: product._id, 
    });

    // --- API FUNCTIONS (Fetch and CRUD) ---

    const fetchSellerProductsApi = async (): Promise<SellerProduct[]> => {
        const finalToken = await getAccessToken(); 
        
        console.log("Attempting GET products with Authorization Header...");
        
        const response = await fetch(`${API_BASE_URL}/products/`, {
            method: 'GET',
            headers: {
                // Ensure correct token format to avoid 401
                'Authorization': `Bearer ${finalToken}`, 
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 403 || response.status === 401) {
                console.warn(`GET products returned ${response.status}. Seller authentication failed.`);
                return []; 
            }
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.map(mapProduct);
    };


    // 1. Initial Draft Submission (POST)
    const handleProductSubmit = async (data: NewProductFormValues, imageUrl: string | null) => {
        try {
            const token = await getAccessToken();
            if (!token) throw new Error("Authentication token is missing. Please log in.");

            const response = await fetch(`${API_BASE_URL}/products/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    stock: data.stock,
                    primaryCategory: data.primaryCategory,
                    subCategory: data.subCategory,
                    aiEnabled: data.aiEnabled,
                    imageUrl1: data.imageUrl1,
                    imageUrl2: data.imageUrl2,
                    imageUrl3: data.imageUrl3,
                    imageUrl4: data.imageUrl4,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`POST Draft failed with status: ${response.status}`, errorText);
                throw new Error(`Failed to create product draft please login again. Status: ${response.status}.`);
            }
            
            const newProduct = mapProduct(await response.json());
            
            if (!newProduct.id) throw new Error("Product ID is missing from response. Check backend serialization.");

            // Optimistic update with the new 'Draft' product
            setProducts(prev => [newProduct, ...prev!]); 
            
            toast({
                title: "Draft Created Successfully! 📝",
                description: `Product draft '${newProduct.name}' is now ready for editing or review submission.`,
                variant: "default",
            });

        } catch (error) {
             console.error("Failed to create product draft:", error);
             
             toast({
                title: "Draft Submission Failed",
                description: (error as Error).message,
                variant: "destructive",
             });
        }
    };

    // 2. Submit for Review (PATCH /submit-review)
    const handleProductSubmitForReview = async (id: string, name: string) => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_BASE_URL}/products/${id}/submit-review`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorJson = await response.json();
                throw new Error(errorJson.msg || "Failed to submit product for review.");
            }
            
            const rawJson = await response.json();
            const updatedProduct = mapProduct(rawJson.product || rawJson);

            setProducts(prev =>
                prev!.map(product =>
                    product.id === id ? updatedProduct : product
                )
            );
            
            toast({
                title: "Submission Successful 📤",
                description: `Product '${name}' is now in 'Pending Review' status, awaiting admin approval.`,
                variant: "default",
            });

        } catch (error) {
            console.error("Failed to submit for review:", error);
            toast({
                title: "Submission Failed",
                description: (error as Error).message,
                variant: "destructive",
            });
        }
    };

    // 🔑 3a. NEW FUNCTION: Unpublish Active Product (PATCH /<id> with status update)
    const handleProductUnpublish = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to take "${name}" offline? It will revert to Draft status.`)) {
            return;
        }

        try {
            const token = await getAccessToken();
            // We use the existing PATCH /<id> route, but only send the status change
            const response = await fetch(`${API_BASE_URL}/products/${id}`, { 
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                // Send status and is_approved fields to force reversion to Draft
                body: JSON.stringify({ 
                    status: 'Draft',
                    is_approved: false
                }),
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                // This will catch the 400 if the status isn't "Active" for some reason, 
                // but primarily handles auth/ownership errors.
                throw new Error(`Failed to unpublish product. Server response: ${errorText}`);
            }
            
            const rawJson = await response.json();
            const updatedProduct = mapProduct(rawJson.product || rawJson); 
            
            setProducts(prev =>
                prev!.map(product =>
                    product.id === id ? updatedProduct : product
                )
            );

            toast({
                title: "Product Unpublished 🛑",
                description: `Product '${name}' is now a Draft and can be edited/deleted.`,
                variant: "default",
            });

        } catch (error) {
             console.error("Failed to unpublish product:", error);
             toast({
                title: "Unpublish Failed",
                description: (error as Error).message,
                variant: "destructive",
             });
        }
    };


    // 3b. Product Update (PATCH /<id>) - This remains the same
    const handleProductUpdate = async (id: string, data: EditProductFormValues, imageUrl: string | null) => {
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_BASE_URL}/products/${id}`, { 
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...data, imageUrl }),
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                // This catches the 400 if the status is Active and no unpublish was done first
                throw new Error(`Failed to update product or ownership denied. Server response: ${errorText}`);
            }
            
            const rawJson = await response.json();
            const updatedProduct = mapProduct(rawJson.product || rawJson); 
            
            setProducts(prev =>
                prev!.map(product =>
                    product.id === id ? updatedProduct : product
                )
            );
            setEditingProduct(null);

            toast({
                title: "Update Successful",
                description: `Product '${updatedProduct.name}' has been updated.`,
                variant: "default",
            });

        } catch (error) {
             console.error("Failed to update product:", error);
             toast({
                title: "Update Failed",
                description: (error as Error).message,
                variant: "destructive",
             });
        }
    };

    // 4. Product Delete (DELETE /<id>) - This remains the same
    const handleProductDelete = async (id: string) => {
        const product = products!.find(p => p.id === id);
        if (!window.confirm(`Are you sure you want to permanently delete product "${product?.name}"?`)) {
            return;
        }
        
        try {
            const token = await getAccessToken();
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // This will throw if status is 400 (Active product)
            if (response.status !== 204) {
                 const errorJson = await response.json();
                 throw new Error(errorJson.msg || "Failed to delete product or ownership denied.");
            }
            
            setProducts(prev => prev!.filter(product => product.id !== id));
            
            toast({
                title: "Product Deleted 🗑️",
                description: `Product '${product?.name}' was successfully removed.`,
                variant: "default",
            });

        } catch (error) {
             console.error("Failed to delete product:", error);
             toast({
                title: "Deletion Failed",
                description: (error as Error).message,
                variant: "destructive",
             });
        }
    };

    const toggleListings = () => {
        setShowListings(prev => !prev);
    };


    // --- EFFECTS (Loading logic) ---
    
    useEffect(() => {
        if (!isAuthLoading && redirectPath) {
            navigate(redirectPath, { replace: true }); 
        }
    }, [isAuthLoading, redirectPath, navigate]); 

    // This effect handles initial loading AND reloading (when products becomes null)
    useEffect(() => {
        const loadProducts = async () => {
            if (isSeller && products === null && !isDataLoading) {
                setIsDataLoading(true);
                try {
                    const data = await fetchSellerProductsApi(); 
                    setProducts(data);
                } catch (error) {
                    console.error("Failed to fetch seller products (Access or Data Error):", error);
                    setProducts([]); 
                } finally {
                    setIsDataLoading(false);
                }
            }
        };

        if (!isAuthLoading && !redirectPath) {
            loadProducts();
        }

    }, [isSeller, products, isDataLoading, isAuthLoading, redirectPath, getAccessToken]); 


    // --- CONDITIONAL RETURN BLOCKS ---
    if (isAuthLoading) { return (
            <div className="flex justify-center items-center h-screen flex-col">
                <Loader2 className="h-10 w-10 animate-spin text-[#ff902b] mb-4" />
                <p className="text-xl text-muted-foreground">Identifying user session...</p>
            </div>
        );}
    if (redirectPath) { return (
             <div className="flex justify-center items-center h-screen">
                 <p className="text-xl text-muted-foreground">Access denied. Redirecting to login...</p>
             </div>
        );}
    if (isBuyerOnly) { return (
            <div className="flex justify-center items-center h-screen flex-col p-4 text-center">
                <Package className="h-10 w-10 text-[#ff902b] mb-4" />
                <h2 className="text-2xl font-bold mb-2">Access Denied: Buyer Account</h2>
                <button 
                    onClick={() => navigate('/')} 
                    className="mt-6 bg-[#ff902b] text-white py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transition-colors font-semibold"
                >
                    Go Home
                </button>
            </div>
        );}
    if (isDataLoading || products === null) { return (
            <div className="flex justify-center items-center h-screen flex-col">
                <Loader2 className="h-10 w-10 animate-spin text-[#ff902b] mb-4" />
                <p className="text-xl text-muted-foreground">Loading your product data...</p>
            </div>
        );}

    // Stats calculation
    const stats = { 
        activeListings: products.filter(p => p.status === 'Active').length,
        totalProducts: products.length,
        totalRevenue: 2500000.00, // Placeholder
        aiEnabledProducts: products.filter(p => p.aiEnabled).length,
    };


    // --- FULL SELLER DASHBOARD RENDER ---
    return (
        <div className="h-full p-4 md:p-8 flex flex-col items-center">
            {/* ... (omitted boilerplate HTML) ... */}
            
            {/* Stat Cards */}
            <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Active Listings" value={stats.activeListings} icon={<CheckCircle className="w-6 h-6 text-green-500" />} colorClass="border-l-4 border-green-500" />
                <StatCard title="Total Products" value={stats.totalProducts} icon={<Package className="w-6 h-6 text-indigo-500" />} colorClass="border-l-4 border-indigo-500" />
                <StatCard title="Total Revenue" value={`RWF ${stats.totalRevenue.toLocaleString('en-RW')}`} icon={<DollarSign className="w-6 h-6 text-[#ff902b]" />} colorClass="border-l-4 border-[#ff902b]" />
                <StatCard title="AI Enabled Products" value={stats.aiEnabledProducts} icon={<Cpu className="w-6 h-6 text-blue-500" />} colorClass="border-l-4 border-blue-500" />
            </div>

            {/* Main Layout (Forms and List) */}
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                
                {/* Left Column: Forms (Post/Edit) */}
                <div className="lg:col-span-1 xl:col-span-2 space-y-8">
                    
                    {/* Conditional Form Rendering */}
                    {editingProduct ? (
                        <ProductEditForm 
                            product={editingProduct}
                            onProductUpdate={handleProductUpdate}
                            onCancel={() => setEditingProduct(null)}
                        />
                    ) : (
                        <ProductPostForm 
                            onProductSubmit={handleProductSubmit}
                        />
                    )}
                </div>

                {/* Right Column: Product Listings */}
                <Card className="lg:col-span-3 w-full glass-medium backdrop-blur-md border border-glass-border shadow-2xl h-fit">
                    <CardHeader 
                        className="p-6 border-b border-glass-border cursor-pointer hover:bg-[#ff902b]/10 transition-colors"
                        onClick={toggleListings}
                    >
                        <CardTitle className="text-2xl flex items-center">
                            <List className='w-5 h-5 mr-2' />
                            Your Current Listings ({products.filter(p => p.status !== 'Archived').length})
                            <span className='ml-auto'>{showListings ? <X className="w-4 h-4"/> : <List className="w-4 h-4"/>}</span>
                        </CardTitle>
                        <CardDescription>View, update, and manage inventory and AI settings for your products.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {showListings && (
                            <ScrollArea className="h-[900px] p-6 scrollbar-primary">
                                <div className="space-y-4">
                                    {products.length > 0 ? (
                                        products.map(product => (
                                            <ProductManagementCard 
                                                key={product.id} 
                                                product={product}
                                                onEdit={setEditingProduct}
                                                onDelete={handleProductDelete}
                                                onSubmitForReview={handleProductSubmitForReview}
                                                // 🔑 NEW PROP PASS: Connect the new function
                                                onUnpublish={handleProductUnpublish} 
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Package className="w-10 h-10 mx-auto mb-3 text-[#ff902b]" />
                                            <p>You have no products listed yet. Get started!</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SellPage;