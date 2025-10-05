// src/components/ProductPostForm.tsx (UPDATED: UI and Category Logic)

import React, { useState, useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Lock, CheckCircle, Image, Cpu } from 'lucide-react'; 
import { 
    Card, CardHeader, CardTitle, CardDescription, CardContent, Form, FormField, FormItem, FormLabel, 
    FormControl, FormDescription, FormMessage, Input, Textarea, Select, SelectContent, 
    SelectItem, SelectTrigger, SelectValue, Switch, Button, styleMocks, categories, 
    topLevelCategories, NewProductFormValues
} from '../lib/ui-mocks';


// --- ZOD SCHEMAS ---
const newProductSchema = z.object({
    name: z.string().min(5, { message: 'Product name must be at least 5 characters.' }).max(100),
    description: z.string().min(20, { message: 'Description must be at least 20 characters.' }).max(500),
    price: z.preprocess((val) => Number(val), z.number().min(100, { message: 'Price must be at least RWF 100.' }).max(10000000).default(0)),
    stock: z.preprocess((val) => Number(val), z.number().int().min(0).max(999).default(1)),
    primaryCategory: z.string().min(1, { message: 'Please select a primary category.' }),
    subCategory: z.string().min(1, { message: 'Please select a sub-category.' }),
    imageFile: z.any().refine((file: any) => file !== null, 'Product image is required.'),
    aiEnabled: z.boolean().default(false),
    otp: z.string()
        .length(6, { message: "OTP must be 6 digits." })
        .regex(/^\d+$/, { message: "OTP must contain only numbers." })
});


interface ProductFormProps {
    onProductSubmit: (data: NewProductFormValues, imageUrl: string | null) => void;
    validOtp: string;
    formRef: React.MutableRefObject<UseFormReturn<NewProductFormValues> | null>;
}

export const ProductPostForm: React.FC<ProductFormProps> = ({ onProductSubmit, validOtp, formRef }) => {
    
    const validateOtp = (value: string) => {
        if (!validOtp) return 'Please generate an OTP first using the panel above.';
        if (value !== validOtp) return 'The OTP is incorrect or has expired. Please re-enter.';
        return true; 
    };

    const schemaWithOtp = newProductSchema.extend({
        otp: z.string().refine(validateOtp, (val) => ({
            message: validateOtp(val) as string
        }))
    });

    const form = useForm<NewProductFormValues>({
        resolver: zodResolver(schemaWithOtp),
        mode: 'onChange',
        defaultValues: {
            name: '', description: '', price: 0, stock: 1, 
            primaryCategory: '', subCategory: '', imageFile: null, aiEnabled: true, otp: ''
        },
    });

    formRef.current = form; 

    const primaryCategoryWatch = form.watch('primaryCategory');
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    // LOGIC: Get the subcategories based on the watched primary category
    const availableSubCategories = useMemo(() => {
        return categories[primaryCategoryWatch] || [];
    }, [primaryCategoryWatch]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        form.setValue('imageFile', file as any, { shouldValidate: true });
        
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);

        if (file) {
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImagePreviewUrl(null);
        }
    };

    const onSubmit = (data: NewProductFormValues) => {
        onProductSubmit(data, imagePreviewUrl);
        
        form.reset({ name: '', description: '', price: 0, stock: 1, primaryCategory: '', subCategory: '', imageFile: null, aiEnabled: true, otp: '' });
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
    };
    
    const isOtpCorrectlyEntered = form.watch('otp') === validOtp && validOtp !== '';

    return (
        // UI FIX: Ensured glass-medium background is applied
        <Card className={styleMocks['glass-medium'] + " " + styleMocks['border-glass-border'] + " shadow-2xl"}>
            <CardHeader className={"p-6 border-b " + styleMocks['border-glass-border']}>
                <CardTitle className="text-2xl flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-[#ff902b]" />
                    Post a New Product
                </CardTitle>
                <CardDescription>Enter product details and use the generated OTP to submit.</CardDescription>
            </CardHeader>

            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* 1. OTP Input Field */}
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field, fieldState }) => ( 
                                <FormItem>
                                    <FormLabel className='flex items-center text-lg font-bold'>
                                        <Lock className="w-4 h-4 mr-2 text-red-500" />
                                        Verification OTP
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Paste your 6-digit OTP here..." 
                                            {...field} 
                                            maxLength={6} 
                                            type="tel"
                                            className={!validOtp ? 'border-red-500' : ''}
                                            disabled={!validOtp} 
                                        />
                                    </FormControl>
                                    {isOtpCorrectlyEntered && (
                                        <FormDescription className="text-green-500 font-semibold flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1" /> OTP is Valid!
                                        </FormDescription>
                                    )}
                                    <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
                                </FormItem>
                            )}
                        />
                        
                        <div className="text-center text-gray-500 pt-4 font-bold">--- Product Details ---</div>

                        {/* 2. NAME */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Premium Gaming Headset" {...field} />
                                    </FormControl>
                                    <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* 3. CATEGORIES */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="primaryCategory"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Primary Category</FormLabel>
                                        <Select onValueChange={(val: string) => { 
                                            field.onChange(val); 
                                            form.setValue('subCategory', ''); // Reset subCategory on change
                                        }} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue>{field.value || 'Select major group'}</SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={"max-h-56 " + styleMocks['scrollbar-primary']}>
                                                {topLevelCategories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subCategory"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Sub-Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={availableSubCategories.length === 0}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue>{field.value || 'Select specific type'}</SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={"max-h-56 " + styleMocks['scrollbar-primary']}>
                                                {availableSubCategories.map(subCat => (
                                                    <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Filtered by Primary Category.</FormDescription>
                                        <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 4. DESCRIPTION */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Product Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe your product in detail..." rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* 5. PRICE AND STOCK */}
                        <div className="grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Price (RWF)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="5000" 
                                                min="100" 
                                                step="100" 
                                                onChange={(e: any) => form.setValue('price', Number(e.target.value), { shouldValidate: true })} 
                                                value={form.watch('price') || ''} 
                                            />
                                        </FormControl>
                                        <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="10" 
                                                min="0" 
                                                step="1" 
                                                onChange={(e: any) => form.setValue('stock', Number(e.target.value), { shouldValidate: true })} 
                                                value={form.watch('stock') || 0} 
                                            />
                                        </FormControl>
                                        <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        {/* 6. AI CHAT TOGGLE */}
                        <FormField
                            control={form.control}
                            name="aiEnabled"
                            render={({ field }) => (
                                <FormItem className={"flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm " + styleMocks['border-glass-border']}>
                                    <div className="space-y-0.5">
                                        <FormLabel className="flex items-center text-base">
                                            <Cpu className="w-5 h-5 mr-2 text-blue-400" />
                                            Enable AI Chat Assistant
                                        </FormLabel>
                                        <FormDescription>AI handles basic buyer questions 24/7.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} className={styleMocks['data-[state=checked]:bg-[#ff902b]']} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        
                        {/* 7. IMAGE UPLOAD AND PREVIEW */}
                        <FormField
                            control={form.control}
                            name="imageFile"
                            render={({ fieldState }) => (
                                <FormItem>
                                    <FormLabel className='flex items-center'>
                                        <Image className="w-4 h-4 mr-2" />
                                        Product Image
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                                    </FormControl>
                                    {imagePreviewUrl && (
                                        <div className="mt-4 w-32 h-32 rounded-lg border-2 border-[#ff902b] overflow-hidden shadow-lg">
                                            <img src={imagePreviewUrl} alt="Product Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <FormMessage>{fieldState.error ? fieldState.error.message : null}</FormMessage>
                                </FormItem>
                            )}
                        />


                        {/* 8. SUBMIT BUTTON */}
                        <Button 
                            type="submit" 
                            variant="glass-primary" 
                            className={"w-full text-lg py-6 " + styleMocks['glass-primary']}
                            disabled={form.formState.isSubmitting || !form.formState.isValid || !isOtpCorrectlyEntered}
                        >
                            {form.formState.isSubmitting ? 'Publishing...' : 'Publish Product Now'}
                        </Button>
                        {!isOtpCorrectlyEntered && (
                            <p className="text-center text-red-500 font-medium">
                                A valid and unused OTP is required to publish.
                            </p>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};