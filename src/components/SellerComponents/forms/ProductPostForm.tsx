import React, { useMemo } from 'react'; // Added useMemo
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Cpu, Image, Send } from 'lucide-react'; 

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
    newProductSchema, 
    NewProductFormValues, 
    categories, 
    topLevelCategories 
} from '@/utils/sellerDashboard.utils';


interface ProductFormProps {
    onProductSubmit: (data: NewProductFormValues, imageUrl: string | null) => void; 
}

export const ProductPostForm: React.FC<ProductFormProps> = ({ onProductSubmit }) => {
    
    const form = useForm<NewProductFormValues>({
        resolver: zodResolver(newProductSchema),
        mode: 'onChange',
        defaultValues: {
            name: '', 
            description: '', 
            price: 0, 
            stock: 1, 
            primaryCategory: undefined, 
            subCategory: undefined,     
            aiEnabled: true, 
            imageUrl1: '',
            imageUrl2: '',
            imageUrl3: '',
            imageUrl4: '',
        },
    });

    const primaryCategoryWatch = form.watch('primaryCategory');
    
    // 🚨 NEW: Watch all four image URL fields
    const [imageUrl1, imageUrl2, imageUrl3, imageUrl4] = form.watch(['imageUrl1', 'imageUrl2', 'imageUrl3', 'imageUrl4']);
    const imageUrls = [imageUrl1, imageUrl2, imageUrl3, imageUrl4];

    // --- Dynamic Sub-Category Logic ---
    const availableSubCategories = useMemo(() => {
        const currentCategory = primaryCategoryWatch || '';
        const subCats = categories[currentCategory as keyof typeof categories];
        
        if (subCats && Array.isArray(subCats)) return subCats;

        return [];
    }, [primaryCategoryWatch]);

    // --- Form Submission ---
    const onSubmit = (data: NewProductFormValues) => {
        // Pass the first image URL as the main image (as per your existing SellPage logic)
        const mainImageUrl = data.imageUrl1 || null; 
        
        onProductSubmit(data, mainImageUrl);
        
        // Reset form after successful submission
        form.reset({ 
            name: '', description: '', price: 0, stock: 1, 
            primaryCategory: undefined, subCategory: undefined, 
            aiEnabled: true,
            imageUrl1: '', imageUrl2: '', imageUrl3: '', imageUrl4: ''
        });
    };

    // Helper component to render an image preview card
    const ImagePreviewCard: React.FC<{ url: string | undefined, index: number }> = ({ url, index }) => {
        // Only render if a URL is present and looks like a URL (basic check)
        if (!url || url.length < 5 || !url.startsWith('http')) {
            return null;
        }

        return (
            <div 
                className="w-full h-32 rounded-lg border-2 border-slate-300 overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg relative"
            >
                <img 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                        // Display a placeholder if the link is broken
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = 'https://via.placeholder.com/128x128?text=Broken+Link';
                    }}
                />
                 <span className="absolute top-1 left-1 bg-[#ff902b] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {index === 0 ? 'Main' : `Extra ${index}`}
                </span>
            </div>
        );
    };


    return (
        <Card className="glass-medium backdrop-blur-md border border-glass-border shadow-2xl h-fit">
            <CardHeader className="p-6 border-b border-glass-border">
                <CardTitle className="text-2xl flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-[#ff902b]" />
                    Submit a Product Draft
                </CardTitle>
                <CardDescription>Enter product details to create a draft, which must be activated by an admin.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="text-center text-muted-foreground pt-4">--- Product Details ---</div>

                        {/* 2. Product Name */}
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

                        {/* 3. Categories */}
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
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value} 
                                            disabled={availableSubCategories.length === 0}
                                        >
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

                        {/* 4. Description */}
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

                        {/* 5. Price and Stock */}
                        <div className="grid grid-cols-2 gap-6">
                             {/* Price */}
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
                                                onChange={(e) => form.setValue('price', Number(e.target.value))} 
                                                value={form.watch('price') === 0 ? '' : form.watch('price')} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Stock */}
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
                                                onChange={(e) => form.setValue('stock', Number(e.target.value))} 
                                                value={form.watch('stock') === 0 ? 0 : form.watch('stock')} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 6. AI Toggle */}
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

                        {/* 7. Image URLs and Previews */}
                        <div className="space-y-4 pt-4 border rounded-lg p-4 border-glass-border shadow-sm">
                            <FormLabel className='flex items-center text-base font-semibold'>
                                <Image className="w-5 h-5 mr-2 text-[#ff902b]" />
                                Product Images (URL Links)
                            </FormLabel>
                            <FormDescription>Enter up to four direct image links. The first link will be the main product photo.</FormDescription>
                            
                            {/* Image URL Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                {['imageUrl1', 'imageUrl2', 'imageUrl3', 'imageUrl4'].map((name, index) => (
                                    <FormField
                                        key={name}
                                        control={form.control}
                                        name={name as keyof NewProductFormValues}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="sr-only">Image Link {index + 1}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`Image Link ${index + 1} ${index === 0 ? '(Main)' : ''}`} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>

                            {/* 🚨 Image Previews */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                {imageUrls.map((url, index) => (
                                    <ImagePreviewCard key={index} url={url} index={index} />
                                ))}
                            </div>
                        </div>

                        {/* 8. Submit Button */}
                        <Button 
                            type="submit" 
                            variant="glass-primary" 
                            className="w-full text-lg py-6"
                            disabled={form.formState.isSubmitting || !form.formState.isValid}
                        >
                            <Send className="w-5 h-5 mr-2" />
                            {form.formState.isSubmitting ? 'Submitting Draft...' : 'Submit Product Draft'}
                        </Button>
                        
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};