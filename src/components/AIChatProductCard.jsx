import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, DollarSign } from 'lucide-react';

// Defines the structure for a single product returned by the AI
interface AIProduct {
    name: string;
    description: string;
    price: number | string;
    source_url: string;
    // 🎯 Field for the primary image link, based on your database structure
    imageUrl1?: string; 
    // Including other potential fields for robust fetching, though imageUrl1 is prioritized
    imageUrl?: string; 
}

interface AIChatProductCardProps {
    products: AIProduct[];
}

export const AIChatProductCard: React.FC<AIChatProductCardProps> = ({ products }) => {
    if (!products || products.length === 0) {
        return <p className="text-sm text-muted-foreground">No relevant products found.</p>;
    }

    return (
        <div className="space-y-3 mt-2">
            <p className="text-xs text-foreground/70 font-semibold italic">
                {products.length} product(s) found in Beltrand Market:
            </p>
            {products.map((product, index) => {
                // 🎯 FINAL IMAGE SOURCE: Prioritize imageUrl1, then check generic imageUrl, then use a placeholder.
                const imageUrlSource = product.imageUrl1 || product.imageUrl || '/placeholder.jpg'; 
                
                return (
                    <Card 
                        key={index} 
                        className="p-3 border border-dashed border-primary/50 bg-card-bg shadow-sm hover:shadow-lg transition-shadow"
                    >
                        <div className="flex gap-3">
                            
                            {/* 1. PRODUCT IMAGE CONTAINER: Uses the URL determined above */}
                            <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-300">
                                <img
                                    src={imageUrlSource}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    // Fallback to a local placeholder if the external image fails
                                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = '/placeholder.jpg'; 
                                    }}
                                />
                            </div>

                            {/* 2. PRODUCT DETAILS */}
                            <div className="flex-1">
                                <CardHeader className="p-0 pb-1 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-bold text-primary max-w-[70%] truncate">
                                        {product.name}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="p-0 space-y-1">
                                    <CardDescription className="text-xs text-foreground/80 line-clamp-2">
                                        {product.description}
                                    </CardDescription>

                                    {/* 3. PRICE (RWF) */}
                                    <div className="flex items-center text-sm font-bold text-green-500 pt-1">
                                        <DollarSign className="w-4 h-4 mr-1" />
                                        RWF {Number(product.price).toLocaleString('en-US')}
                                    </div>

                                    {/* 4. LINK */}
                                    {product.source_url && (
                                        <a 
                                            href={product.source_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            View Product Details <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    )}
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};