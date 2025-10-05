import React, { useState, useEffect, useCallback } from 'react'; // Added useEffect/useCallback to the import line
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Cpu, Image, X, Send } from 'lucide-react'; 

// --- Component Imports ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';

// --- Utility Imports ---
import { 
    editProductSchema, 
    EditProductFormValues, 
    SellerProduct, 
    categories, 
    topLevelCategories 
} from '@/utils/sellerDashboard.utils';

// 🚨 NOTE: Assuming you update EditProductFormValues to include imageUrl as a string, not imageFile as a File.
// If your schema only accepts imageFile, you'll need to update it as well.
interface EditFormValuesWithUrl extends Omit<EditProductFormValues, 'imageFile'> {
    imageUrl: string; // Using a string URL for the form field
}


interface ProductEditFormProps {
    product: SellerProduct;
    // 🚨 IMPORTANT: Updated signature to pass the updated URL string, not a File object
    onProductUpdate: (id: string, data: EditFormValuesWithUrl, imageUrl: string | null) => void; 
    onCancel: () => void;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({ product, onProductUpdate, onCancel }) => {
    
    // 1. Initialize form with current product data and the existing image URL
    const form = useForm<EditFormValuesWithUrl>({
        // 🚨 NOTE: Resolver should be updated to validate 'imageUrl' string instead of 'imageFile'
        // resolver: zodResolver(editProductSchema), 
        mode: 'onChange',
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            primaryCategory: product.primaryCategory,
            subCategory: product.subCategory,
            // 🚨 FIX 1: Initialize the form with the existing URL string
            imageUrl: product.imageUrl || '', 
            aiEnabled: product.aiEnabled,
        },
    });

    const primaryCategoryWatch = form.watch('primaryCategory');
    // 🚨 FIX 2: Watch the 'imageUrl' field from the form to handle preview
    const imageUrlWatch = form.watch('imageUrl');

    // --- Dynamic Sub-Category Logic (Same as Post Form) ---
    const availableSubCategories = React.useMemo(() => {
        const subCats = categories[primaryCategoryWatch];
        if (subCats) return subCats;
        const foundKey = Object.keys(categories).find(key => categories[key].includes(primaryCategoryWatch));
        if (foundKey) return categories[primaryCategoryWatch];
        return [];
    }, [primaryCategoryWatch]);

    // --- Form Submission ---
    const onSubmit = (data: EditFormValuesWithUrl) => {
        // 🚨 FIX 3: Pass the updated URL directly from the form data
        // The third argument (imageUrl) is now simply the value of the form field.
        onProductUpdate(product.id, data, data.imageUrl);
    };
    
    // Cleanup Effect (Only needed for file uploads, but kept for general practice)
    // useEffect(() => { ... cleanup logic ... }, [imagePreviewUrl]);


    return (
        <Card className="glass-medium backdrop-blur-md border border-glass-border shadow-2xl h-fit">
            <CardHeader className="p-6 border-b border-glass-border">
                <CardTitle className="text-2xl flex items-center text-[#ff902b]">
                    <Edit className="w-5 h-5 mr-2" />
                    Editing Product: {product.name}
                </CardTitle>
                <CardDescription>Update details for Product ID: {product.id}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* 1. Product Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Premium Gaming Headset" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 2. Categories (Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="primaryCategory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select primary group" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-56 scrollbar-primary">
                                                {topLevelCategories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                                {Object.values(categories).flat().filter(cat => categories[cat]).map(cat => (
                                                     <SelectItem key={cat} value={cat}>{cat} (Sub-Groups)</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subCategory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sub-Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={availableSubCategories.length === 0}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select specific type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-56 scrollbar-primary">
                                                {availableSubCategories.map(subCat => (
                                                    <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 3. Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe your product in detail..." rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 4. Price and Stock (Grid) */}
                        <div className="grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="price"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Price (RWF)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="5000" 
                                                min="100" 
                                                step="100" 
                                                onChange={(e) => form.setValue('price', Number(e.target.value), { shouldValidate: true })} 
                                                value={form.watch('price')} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="10" 
                                                min="0" 
                                                step="1" 
                                                onChange={(e) => form.setValue('stock', Number(e.target.value), { shouldValidate: true })} 
                                                value={form.watch('stock')} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 5. AI Toggle */}
                        <FormField
                            control={form.control}
                            name="aiEnabled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm border-glass-border">
                                    <div className="space-y-0.5">
                                        <FormLabel className="flex items-center text-base">
                                            <Cpu className="w-5 h-5 mr-2 text-blue-400" />
                                            Enable AI Chat Assistant
                                        </FormLabel>
                                        <FormDescription>AI handles basic buyer questions 24/7.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-[#ff902b]" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        
                        {/* 6. Image URL Input & Preview */}
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center'>
                                        <Image className="w-4 h-4 mr-2" />
                                        Update Product Image URL
                                    </FormLabel>
                                    <FormControl>
                                        {/* 🚨 FIX 4: Use text input for URL */}
                                        <Input type="url" placeholder="Paste new image link here..." {...field} />
                                    </FormControl>
                                    {/* 🚨 FIX 5: Use imageUrlWatch for live preview */}
                                    {imageUrlWatch && (
                                        <div className="mt-4 w-32 h-32 rounded-lg border-2 border-[#ff902b] overflow-hidden shadow-lg">
                                            <img src={imageUrlWatch} alt="Product Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <FormDescription>Current Image: {product.imageUrl || "None"}. Update the URL above to change it.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 7. Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <Button 
                                type="submit" 
                                variant="glass-primary" 
                                className="w-full text-lg py-6"
                                disabled={form.formState.isSubmitting || !form.formState.isValid}
                            >
                                <Send className="w-5 h-5 mr-2" />
                                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full text-lg py-6 border-glass-border"
                                onClick={onCancel}
                            >
                                <X className="w-5 h-5 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};