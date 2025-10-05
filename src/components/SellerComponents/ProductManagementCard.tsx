// file path: components/SellerComponents/ProductManagementCard.tsx

import React from 'react';
import { 
    Package, DollarSign, Edit, Trash2, Globe, CheckCircle, 
    XCircle, Cpu, X, Send, Clock, AlertTriangle, List, PowerOff
} from 'lucide-react'; 

// --- Component Imports ---
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// --- Utility Imports ---
import { SellerProduct } from '@/utils/sellerDashboard.utils';


interface ProductManagementCardProps {
    product: SellerProduct;
    onEdit: (product: SellerProduct) => void;
    onDelete: (id: string) => void;
    onSubmitForReview: (id: string, name: string) => void; 
    // 🔑 NEW PROP: Handler for unpublishing the product
    onUnpublish: (id: string, name: string) => void; 
}

export const ProductManagementCard: React.FC<ProductManagementCardProps> = ({ 
    product, 
    onEdit, 
    onDelete,
    onSubmitForReview,
    onUnpublish // Destructure new prop
}) => {
    
    // 🔑 CORE LOGIC: Determine button visibility based on status
    // Deletable/Editable: Anything NOT Active
    const isEditable = product.status !== 'Active';
    const isDeletable = product.status !== 'Active'; 
    const isSubmitReady = product.status === 'Draft' || product.status === 'Rejected';
    const isActive = product.status === 'Active';
    const isPending = product.status === 'Pending Review';

    // 🔑 EXTENDED STATUS MAP: Includes all states
    const statusMap = {
        'Active': { text: 'Active/Live', colorClass: 'bg-green-600 hover:bg-green-700', icon: CheckCircle },
        'Draft': { text: 'Draft', colorClass: 'bg-gray-500 hover:bg-gray-600', icon: Edit },
        'Pending Review': { text: 'Pending', colorClass: 'bg-blue-600 hover:bg-blue-700', icon: Clock },
        'Rejected': { text: 'Rejected', colorClass: 'bg-orange-500 hover:bg-orange-600', icon: XCircle },
        'Archived': { text: 'Archived', colorClass: 'bg-indigo-500 hover:bg-indigo-600', icon: Trash2 },
    };
    
    const { text, colorClass: statusColor, icon: StatusIcon } = statusMap[product.status as keyof typeof statusMap] || statusMap.Draft;

    // Determine stock color for visual urgency
    const stockColor = product.stock_quantity > 10 ? 'text-green-500' : product.stock_quantity > 0 ? 'text-yellow-500' : 'text-red-500';

    return (
        <Card className="glass-light backdrop-blur-sm border border-glass-border shadow-lg transition-all hover:shadow-xl hover:scale-[1.005]">
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
                
                {/* Product Info (Image, Name, Category, Status) */}
                <div className="flex items-center flex-shrink-0 w-full md:w-auto">
                    <div className="h-16 w-16 mr-4 rounded-lg overflow-hidden border-2 border-[#ff902b] flex-shrink-0">
                        {product.imageUrl1 ? (
                             <img src={product.imageUrl1} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Image className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col w-full min-w-0">
                        <CardTitle className="text-lg font-bold truncate text-foreground">{product.name}</CardTitle>
                        <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
                            <Globe className="w-3 h-3 mr-1" />
                            {product.category}
                        </CardDescription>
                        <div className="flex space-x-2 mt-1">
                            {/* Status Badge */}
                            <Badge className={`px-2 py-0.5 text-xs font-semibold ${statusColor} text-white`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {text}
                            </Badge>
                            {/* AI Badge */}
                            <Badge className={`px-2 py-0.5 text-xs font-semibold ${product.aiEnabled ? 'bg-blue-600' : 'bg-gray-700'} text-white`}>
                                {product.aiEnabled ? (
                                    <Cpu className="w-3 h-3 mr-1" />
                                ) : (
                                    <X className="w-3 h-3 mr-1" />
                                )}
                                AI Chat {product.aiEnabled ? 'ON' : 'OFF'}
                            </Badge>
                        </div>
                    </div>
                </div>
                
                {/* Metrics and Actions */}
                <div className="flex items-center space-x-6 flex-shrink-0 w-full md:w-auto mt-3 md:mt-0 justify-between md:justify-start">
                    
                    {/* Price */}
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Price</span>
                        <div className="text-lg font-extrabold text-[#ff902b] flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {parseFloat(product.price as string).toLocaleString('en-RW')}
                        </div>
                    </div>
                    
                    {/* Stock */}
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Stock</span>
                        <div className={`text-lg font-extrabold ${stockColor}`}>
                            {product.stock_quantity}
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
                         {/* 🔑 UNPUBLISH BUTTON (Highest Priority when Active) */}
                         {isActive && (
                            <Button 
                                size="sm" 
                                variant="destructive"
                                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                onClick={() => onUnpublish(product.id, product.name)}
                                title="Unpublish to make changes"
                            >
                                <PowerOff className="w-4 h-4 mr-1" />
                                Unpublish
                            </Button>
                        )}

                         {/* SUBMIT FOR REVIEW BUTTON (Only visible for Draft/Rejected) */}
                         {isSubmitReady && (
                            <Button 
                                size="sm" 
                                variant="default"
                                className="bg-[#ff902b] hover:bg-orange-600"
                                onClick={() => onSubmitForReview(product.id, product.name)}
                            >
                                <Send className="w-4 h-4 mr-1" />
                                Submit
                            </Button>
                        )}
                        
                        <div className="flex space-x-2">
                             {/* EDIT BUTTON (Disabled if Active) */}
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-9 w-9 border-glass-border hover:bg-hover-orange/10 hover:text-[#ff9203]"
                                onClick={() => onEdit(product)}
                                disabled={!isEditable} 
                                title={isEditable ? "Edit Product" : "Unpublish to Edit"}
                            >
                                <Edit className="w-5 h-5" />
                            </Button>
                            
                            {/* DELETE BUTTON (Disabled if Active) */}
                            <Button 
                                variant="destructive" 
                                size="icon" 
                                className="h-9 w-9 bg-red-600/80 hover:bg-red-700"
                                onClick={() => onDelete(product.id)}
                                disabled={!isDeletable}
                                title={isDeletable ? "Delete Product" : "Unpublish to Delete"}
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
            
            {/* 🔑 CLARITY MESSAGE DIV (Well-Designed Status Feedback) */}
            <div className="p-3 text-sm rounded-b-lg mt-0">
                {isActive && (
                    <div className="text-yellow-800 font-medium flex items-center p-2 rounded bg-yellow-100/70 border border-yellow-400">
                        <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0"/>
                        <span className="font-bold">LIVE PRODUCT:</span> Click **Unpublish** to take it offline and enable editing/deletion.
                    </div>
                )}
                {isPending && (
                    <div className="text-blue-700 font-medium flex items-center p-2 rounded bg-blue-100/70 border border-blue-400">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0"/>
                        **Pending Review.** Locked from customer view. Any updates will revert it to Draft status.
                    </div>
                )}
                 {product.status === 'Rejected' && (
                    <div className="text-red-700 font-medium flex items-start p-2 rounded bg-red-100/70 border border-red-400">
                        <XCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"/>
                        **Rejected.** Please review admin notes and resubmit for approval.
                    </div>
                )}
                {product.status === 'Draft' && (
                     <div className="text-gray-600 font-medium flex items-center p-2 rounded bg-gray-100/70 border border-gray-400">
                        <List className="w-4 h-4 mr-2 flex-shrink-0"/>
                        **Draft.** Ready for submission when details are complete.
                    </div>
                )}
            </div>
        </Card>
    );
};