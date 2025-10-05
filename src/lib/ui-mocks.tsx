// src/lib/ui-mocks.tsx

import React, { useRef } from 'react';

// --- UI COMPONENT MOCKS (Optimized for Dark Theme and Glass) ---
// Key Style: backdrop-filter backdrop-blur-md/lg ensures the background is blurred.
export const Card = (props: any) => <div {...props} className={"bg-white/10 border border-gray-700/50 rounded-xl backdrop-filter backdrop-blur-lg " + props.className} />;
export const CardContent = (props: any) => <div {...props} className={"p-4 " + props.className} />;
export const CardDescription = (props: any) => <p {...props} className={"text-sm text-gray-400 " + props.className} />;
export const CardHeader = (props: any) => <div {...props} className={"p-4 border-b border-gray-700/50 " + props.className} />;
export const CardTitle = (props: any) => <h3 {...props} className={"text-xl font-semibold text-white " + props.className} />;

export const Button = (props: any) => <button {...props} className={"px-4 py-2 rounded-lg font-medium transition-colors " + (props.variant === 'glass-primary' ? 'bg-[#ff902b] text-white hover:bg-orange-600' : (props.variant === 'destructive' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-700 text-white hover:bg-gray-600')) + " " + props.className} disabled={props.disabled} />;
export const Badge = (props: any) => <span {...props} className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " + props.className} />;
export const ScrollArea = (props: any) => <div {...props} className={"overflow-y-auto " + props.className} />;

export const Input = (props: any) => <input {...props} className={"w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white focus:ring-[#ff902b] focus:border-[#ff902b] " + props.className} disabled={props.disabled} value={props.value ?? ''} />;
export const Textarea = (props: any) => <textarea {...props} className={"w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white focus:ring-[#ff902b] focus:border-[#ff902b] " + props.className} />;
export const Switch = (props: any) => <button {...props} onClick={() => props.onCheckedChange(!props.checked)} className={"w-10 h-6 rounded-full p-0.5 transition-colors " + (props.checked ? 'bg-[#ff902b]' : 'bg-gray-400')}><span className={"block w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform " + (props.checked ? 'translate-x-4' : 'translate-x-0')} /></button>;

export const Select = (props: any) => <select {...props} onChange={(e) => props.onValueChange(e.target.value)} value={props.value} className={"w-full px-3 py-2 border border-gray-600 rounded-md bg-black/30 text-white " + (props.disabled ? 'bg-gray-800' : '')} >{props.children}</select>;
export const SelectContent = (props: any) => <>{props.children}</>;
export const SelectItem = (props: any) => <option value={props.value} className='bg-gray-800 text-white'>{props.children}</option>;
export const SelectTrigger = (props: any) => <option disabled className='bg-gray-800 text-gray-400'>{props.children}</option>;
export const SelectValue = (props: any) => <>{props.children}</>;


// --- RHF FORM MOCKS ---
export const Form = (props: any) => <div {...props}>{props.children}</div>;
export const FormControl = (props: any) => <div {...props}>{props.children}</div>;
export const FormDescription = (props: any) => <p {...props} className={"text-xs text-gray-400 mt-1 " + props.className} />;
export const FormItem = (props: any) => <div {...props} className={"space-y-1 " + props.className} />;
export const FormLabel = (props: any) => <label {...props} className={"text-sm font-medium block text-gray-200 " + props.className} />;
export const FormMessage = (props: any) => <p {...props} className={"text-xs text-red-400 " + props.className}>{props.children}</p>;
export const FormField = ({ control, name, render }: any) => {
    if (!control || !control.getValues || !control.formState) return null;
    const mockField = {
        name: name,
        value: control.getValues(name) ?? '', 
        onChange: (e: any) => {
            const val = typeof e === 'object' && e.target ? e.target.value : e;
            control.setValue(name, val, { shouldValidate: true, shouldDirty: true });
        },
        onBlur: () => control.trigger(name),
        ref: useRef(null)
    };
    const mockFieldState = { error: control.formState.errors[name] };
    return (
        <div data-rhf-name={name}>
            {render({ field: mockField, fieldState: mockFieldState, formState: control.formState })}
        </div>
    );
};

// --- STYLE MOCKS (The core definitions for the blurred effect) ---
export const styleMocks = {
    'glass-medium': 'bg-white/10 backdrop-filter backdrop-blur-lg',
    'glass-light': 'bg-white/5 backdrop-filter backdrop-blur-md',
    'border-glass-border': 'border-gray-700/50',
    'bg-gradient-primary': 'bg-gradient-to-r from-yellow-500 to-orange-500',
    'bg-clip-text': 'text-clip', 
    'text-transparent': 'text-transparent', 
    'scrollbar-primary': 'overflow-y-scroll',
    'hover-orange/10': 'hover:bg-orange-900/20',
    'hover:text-[#ff9203]': 'hover:text-orange-500',
    'data-[state=checked]:bg-[#ff902b]': 'bg-orange-500',
    'variant-destructive': 'bg-red-600 hover:bg-red-700 text-white',
    'variant-outline': 'bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300',
};

// --- DATA STRUCTURES (Used by both Seller and Favourite pages) ---
export interface SellerProduct {
    id: string; name: string; price: number; stock: number; primaryCategory: string; 
    subCategory: string; status: 'Active' | 'Draft' | 'Out of Stock' | 'Archived';
    imageUrl: string; aiEnabled: boolean; dateAdded: string;
}

export type NewProductFormValues = {
    name: string; description: string; price: number; stock: number; primaryCategory: string; 
    subCategory: string; imageFile: File | null; aiEnabled: boolean; otp: string;
}

export const mockSellerProducts: SellerProduct[] = [
    { id: 'PROD-001', name: 'Premium Espresso Beans (1Kg)', price: 15000, stock: 45, primaryCategory: 'Home & Kitchen', subCategory: 'Kitchen Tools', status: 'Active', imageUrl: 'https://i.pravatar.cc/150?img=47', aiEnabled: true, dateAdded: '2025-09-01' },
    { id: 'PROD-002', name: 'Handmade Rwandan Basket', price: 25000, stock: 12, primaryCategory: 'Home & Kitchen', subCategory: 'Decor', status: 'Active', imageUrl: 'https://i.pravatar.cc/150?img=52', aiEnabled: false, dateAdded: '2025-09-05' },
];

export const mockFavouriteProducts: SellerProduct[] = [
    { id: 'PROD-101', name: 'Ultra-Slim 5G Android Phone', price: 650000, stock: 15, primaryCategory: 'Mobile Phones', subCategory: 'Android', status: 'Active', imageUrl: 'https://i.pravatar.cc/150?img=17', aiEnabled: true, dateAdded: '2025-10-01' },
    { id: 'PROD-102', name: 'Business Travel Laptop i7', price: 1200000, stock: 8, primaryCategory: 'Laptops & PCs', subCategory: 'Business Laptops', status: 'Active', imageUrl: 'https://i.pravatar.cc/150?img=25', aiEnabled: false, dateAdded: '2025-09-28' },
    { id: 'PROD-103', name: 'JBL Noise Cancelling Headphones', price: 85000, stock: 30, primaryCategory: 'Accessories', subCategory: 'Headphones & Audio', status: 'Active', imageUrl: 'https://i.pravatar.cc/150?img=33', aiEnabled: true, dateAdded: '2025-10-02' },
    { id: 'PROD-104', name: 'High-Waisted Skinny Jeans', price: 45000, stock: 50, primaryCategory: 'Women\'s Clothing', subCategory: 'Pants & Jeans', status: 'Active', imageUrl: 'https://i.pravatar.cc/150?img=49', aiEnabled: false, dateAdded: '2025-10-01' },
];

export const categories: { [key: string]: string[]; } = {
    'Mobile Phones': ['Android', 'iPhone', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Other Brands'],
    'Laptops & PCs': ['Gaming Laptops', 'Business Laptops', 'Desktop PCs', 'MacBooks', 'Chromebooks'],
    'Accessories': ['Headphones & Audio', 'Speakers'],
    'Women\'s Clothing': ['Dresses', 'Tops & Blouses', 'Pants & Jeans', 'Skirts', 'Outerwear', 'Activewear', 'Underwear'],
    'Men\'s Clothing': ['Shirts', 'T-Shirts', 'Pants & Jeans', 'Shorts', 'Suits', 'Activewear', 'Underwear'],
    'Home & Kitchen': ['Furniture', 'Appliances', 'Decor', 'Kitchen Tools', 'Bedding', 'Storage'],
    'Sports & Fitness': ['Exercise Equipment', 'Sportswear', 'Outdoor Gear', 'Supplements', 'Yoga & Pilates'],
};

export const topLevelCategories: string[] = Object.keys(categories);