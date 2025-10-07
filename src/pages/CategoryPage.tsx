import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/utils/api'; 
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/product/ProductCard'; 
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button'; 
import { Frown, ArrowLeft } from 'lucide-react';

// 🎯 FIX 1: Update the interface to match the final API (Python serialize_product) output
interface ProductAPIResponse {
    id: string; // Renamed from _id
    title: string; // Renamed from name
    price: number | null; 
    originalPrice?: number | null;
    image: string; // Renamed from imageUrl1
    rating: number;
    reviewCount: number;
    seller: { name: string; rating: number; } | null; // Guaranteed object/null check
    // Other fields can be left out or marked optional if not needed by the card
}

interface CategoryPageData {
    title: string;
    products: ProductAPIResponse[];
    count: number;
}

export const CategoryPage: React.FC = () => {
    const { categoryName, subCategoryName } = useParams<{ categoryName?: string; subCategoryName?: string }>();
    const [productsData, setProductsData] = useState<CategoryPageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // ... (pageTitle generation logic remains the same) ...
    const pageTitle = (subCategoryName 
        ? subCategoryName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : categoryName 
            ? categoryName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            : 'All Products'
    ) + ' Products';


    const fetchCategoryProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setProductsData(null); 

        let url = `/productapi/productcategory`; 
        if (categoryName) {
            url += `/${categoryName}`;
        }
        if (subCategoryName) {
            url += `/${subCategoryName}`;
        }

        try {
            const response = await api.get<CategoryPageData>(url);
            // CRITICAL: response.data contains { title, products: [...] }
            setProductsData(response.data); 
        } catch (err: any) {
            console.error('Failed to fetch category products:', err);
            setError(err.response?.data?.msg || 'Failed to load products for this category.');
            toast({
                title: 'Error',
                description: err.response?.data?.msg || 'Could not load products.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [categoryName, subCategoryName, toast]);

    useEffect(() => {
        fetchCategoryProducts();
    }, [fetchCategoryProducts]);

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {/* ... (Loading and Error UI remains the same) ... */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-foreground">
                    {pageTitle}
                </h1>
                <Link to="/" className="text-muted-foreground hover:text-[#ff902b] flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>
            </div>
            
            {isLoading && (
                <div className="flex justify-center items-center h-64 glass-medium p-4 rounded-lg border border-glass-border">
                    <Spinner size="lg" />
                    <p className="ml-3 text-lg text-muted-foreground">Loading products...</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center h-64 glass-medium p-4 rounded-lg border border-glass-border text-destructive">
                    <Frown className="w-16 h-16 mb-4" />
                    <p className="text-xl font-semibold mb-2">{error}</p>
                    <p className="text-muted-foreground">Please try again or browse other categories.</p>
                    <Button onClick={fetchCategoryProducts} className="mt-4 bg-gradient-primary hover:opacity-90">Retry Load</Button>
                </div>
            )}


            {!isLoading && !error && productsData && (
                <>
                    {productsData.products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 glass-medium p-4 rounded-lg border border-glass-border text-muted-foreground">
                            <Frown className="w-16 h-16 mb-4" />
                            <p className="text-xl font-semibold mb-2">No products found in this category.</p>
                            <p>Try exploring other categories or check back later!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {productsData.products.map(product => (
                                // 🎯 FIX 2: Pass the correctly mapped props required by ProductCard
                                <ProductCard 
                                    key={product.id} // Use the correct ID field
                                    id={product.id}
                                    title={product.title}
                                    price={product.price}
                                    originalPrice={product.originalPrice}
                                    image={product.image}
                                    rating={product.rating}
                                    reviewCount={product.reviewCount}
                                    seller={product.seller}
                                    // Add any other props like 'badge' here if needed
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};