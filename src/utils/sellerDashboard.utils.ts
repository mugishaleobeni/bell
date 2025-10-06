// File: src/utils/sellerDashboard.utils.ts

import * as z from 'zod';

// --- INTERFACE/TYPE DEFINITIONS ---

/** Defines the structure of the category mapping. */
export type Category = {
    [key: string]: string[];
};

/** Defines the structure for a product managed by a seller. */
export interface SellerProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
    primaryCategory: string; 
    subCategory: string;    
    status: 'Active' | 'Draft' | 'Out of Stock' | 'Archived';
    imageUrl: string; 
    aiEnabled: boolean;     
    dateAdded: string;
    description: string;
}

// --- ZOD SCHEMAS ---

/** Base schema for product fields, now including 4 Image URL fields. */
const baseProductSchema = z.object({
    name: z.string().min(5, { message: 'Product name must be at least 5 characters.' }).max(100),
    description: z.string().min(20, { message: 'Description must be at least 20 characters.' }).max(500),
    price: z.preprocess((val) => Number(val), z.number().min(100, "Price must be at least 100 RWF.").max(10000000, "Price cannot exceed 10,000,000 RWF.")),
    stock: z.preprocess((val) => Number(val), z.number().int().min(0, "Stock cannot be negative.").max(999, "Stock quantity too high.")),
    
    primaryCategory: z.string().min(1, { message: 'Please select a primary category.' }),
    subCategory: z.string().min(1, { message: 'Please select a sub-category.' }),
    aiEnabled: z.boolean().default(false),

    imageUrl1: z.string().url("Must be a valid URL.").min(1, "At least one primary image link is required."),
    imageUrl2: z.union([z.literal(''), z.string().url("Must be a valid URL if provided.")]).optional(),
    imageUrl3: z.union([z.literal(''), z.string().url("Must be a valid URL if provided.")]).optional(),
    imageUrl4: z.union([z.literal(''), z.string().url("Must be a valid URL if provided.")]).optional(),
});

/** Schema for creating a new product (OTP is optional for draft). */
export const newProductSchema = baseProductSchema.extend({
    otp: z.string()
        .length(6, { message: "OTP must be 6 digits." })
        .regex(/^\d+$/, { message: "OTP must contain only numbers." })
        .optional() 
});

/** Schema for editing an existing product. */
export const editProductSchema = baseProductSchema; 

// --- EXPORTED TYPES (Cleaned up for clarity) ---
export type NewProductFormValues = z.infer<typeof newProductSchema>;
export type EditProductFormValues = z.infer<typeof editProductSchema>;


// --- CATEGORY DATA ---

// Define a separate, explicit list of ONLY the highest-level categories.
export const topLevelCategories: string[] = [
    'Mobile Phones', 
    'Laptops & PCs',
    'Headphones & Audio',
    'Women\'s Clothing',
    'Men\'s Clothing',
    'Home & Kitchen',
    'Sports & Fitness',
];


export const categories: Category = {
    // 1. Mobile Phones
    'Mobile Phones': ['Android', 'iPhone', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Other Brands'],
    
    // 2. Laptops & PCs
    'Laptops & PCs': ['Gaming Laptops', 'Business Laptops', 'Desktop PCs', 'MacBooks', 'Chromebooks','Other Computers'],
    
    // 3. Headphones & Audio
    'Headphones & Audio': ['JBL', 'Sony', 'Bose', 'Apple AirPods', 'Samsung Buds', 'Gaming Headsets', 'Speakers','Other Audio Devices'], 
    
    // 4. Women's Clothing
    'Women\'s Clothing': ['Dresses', 'Tops & Blouses', 'Pants & Jeans', 'Skirts', 'Outerwear', 'Activewear', 'Underwear','other'],
    
    // 5. Men's Clothing
    'Men\'s Clothing': ['Shirts', 'T-Shirts', 'Pants & Jeans', 'Shorts', 'Suits', 'Activewear', 'Underwear','other'],
    
    // 6. Home & Kitchen
    'Home & Kitchen': ['Furniture', 'Appliances', 'Decor', 'Kitchen Tools', 'Bedding', 'Storage','other'],
    
    // 7. Sports & Fitness
    'Sports & Fitness': ['Exercise Equipment', 'Sportswear', 'Outdoor Gear', 'Supplements', 'Yoga & Pilates','other'],
};

// --- MOCK DATA (Remains for development testing) ---
export const mockSellerProducts: SellerProduct[] = [
    // ... (Your mock data here) ...
];