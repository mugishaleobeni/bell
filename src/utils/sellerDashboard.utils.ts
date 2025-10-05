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
    // NOTE: This interface should probably be updated to handle the 4 image URLs
    imageUrl: string; // Keeping for compatibility with mock data for now
    aiEnabled: boolean;     
    dateAdded: string;
    description: string;
}

// --- ZOD SCHEMAS ---

/** Base schema for product fields, now including 4 Image URL fields. */
const baseProductSchema = z.object({
    name: z.string().min(5, { message: 'Product name must be at least 5 characters.' }).max(100),
    description: z.string().min(20, { message: 'Description must be at least 20 characters.' }).max(500),
    // Preprocess converts the input string value from the <input type="number"> into a number
    price: z.preprocess((val) => Number(val), z.number().min(100, "Price must be at least 100 RWF.").max(10000000, "Price cannot exceed 10,000,000 RWF.")),
    stock: z.preprocess((val) => Number(val), z.number().int().min(0, "Stock cannot be negative.").max(999, "Stock quantity too high.")),
    
    // NOTE: The schema itself DOES NOT prevent multiple products in the same category.
    primaryCategory: z.string().min(1, { message: 'Please select a primary category.' }),
    subCategory: z.string().min(1, { message: 'Please select a sub-category.' }),
    aiEnabled: z.boolean().default(false),

    // 🛑 NEW: 4 Image URL fields 🛑
    imageUrl1: z.string().url("Must be a valid URL.").min(1, "At least one primary image link is required."),
    // imageUrl2/3/4 can be a valid URL or an empty string, meaning they are optional
    imageUrl2: z.union([z.literal(''), z.string().url("Must be a valid URL if provided.")]).optional(),
    imageUrl3: z.union([z.literal(''), z.string().url("Must be a valid URL if provided.")]).optional(),
    imageUrl4: z.union([z.literal(''), z.string().url("Must be a valid URL if provided.")]).optional(),
});

/** Schema for creating a new product (OTP is required). */
// NOTE: imageFile HAS BEEN REMOVED AND REPLACED BY imageUrl1-4
export const newProductSchema = baseProductSchema.extend({
    // OTP field (runtime validation happens in ProductPostForm)
    otp: z.string()
        .length(6, { message: "OTP must be 6 digits." })
        .regex(/^\d+$/, { message: "OTP must contain only numbers." })
        .optional() // Making OTP optional in schema for draft creation phase
});

/** Schema for editing an existing product (no extra fields needed). */
export const editProductSchema = baseProductSchema; 

// Infer types from schemas for form use (These must also be EXPORTED)
export type NewProductFormValues = z.infer<typeof newProductSchema>;
export type EditProductFormValues = z.infer<typeof editProductSchema>;


// --- CATEGORY DATA (Also EXPORTED) ---

// Define a separate, explicit list of ONLY the highest-level categories.
// This list is used to populate the main dropdown.
export const marketSegments: string[] = [
    'Electronics',
    'Women\'s Clothing',
    'Men\'s Clothing',
    'Home & Kitchen',
    'Sports & Fitness',
];


export const categories: Category = {
    // Top-level categories should map to their immediate subcategories.
    'Electronics': ['Mobile Phones', 'Laptops & PCs', 'Headphones & Audio', 'Speakers'],
    
    // Deeper Branching: Since 'Mobile Phones' is selected as a primary category in the form, 
    // it MUST be present as a key here for the sub-category dropdown to work when 'Mobile Phones' is selected.
    'Mobile Phones': ['Android', 'iPhone', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Other Brands'],
    
    'Laptops & PCs': ['Gaming Laptops', 'Business Laptops', 'Desktop PCs', 'MacBooks', 'Chromebooks'],
    'Headphones & Audio': ['JBL', 'Sony', 'Bose', 'Apple AirPods', 'Samsung Buds', 'Gaming Headsets'],
    'Women\'s Clothing': ['Dresses', 'Tops & Blouses', 'Pants & Jeans', 'Skirts', 'Outerwear', 'Activewear', 'Underwear'],
    'Men\'s Clothing': ['Shirts', 'T-Shirts', 'Pants & Jeans', 'Shorts', 'Suits', 'Activewear', 'Underwear'],
    'Home & Kitchen': ['Furniture', 'Appliances', 'Decor', 'Kitchen Tools', 'Bedding', 'Storage'],
    'Sports & Fitness': ['Exercise Equipment', 'Sportswear', 'Outdoor Gear', 'Supplements', 'Yoga & Pilates'],
};

// 🛑 FIX APPLIED: topLevelCategories now uses the clean, explicit marketSegments array.
// This resolves the category filtering bug that was causing issues with new and deep categories.
export const topLevelCategories = marketSegments; 


// --- MOCK DATA (Also EXPORTED) ---
export const mockSellerProducts: SellerProduct[] = [
    { id: 'PROD-001', name: 'Premium Espresso Beans (1Kg)', price: 15000, stock: 45, primaryCategory: 'Home & Kitchen', subCategory: 'Kitchen Tools', status: 'Active', imageUrl: 'https://i.pravatar.cc/150?img=47', aiEnabled: true, dateAdded: '2025-09-01', description: 'High-quality espresso beans, roasted to perfection.' },
    { id: 'PROD-002', name: 'Handmade Rwandan Basket', price: 25000, stock: 12, primaryCategory: 'Home & Kitchen', subCategory: 'Decor', status: 'Active', imageUrl: 'https://i.pravatar.cc/150?img=52', aiEnabled: false, dateAdded: '2025-09-05', description: 'Beautifully crafted traditional Rwandan basket.' },
    { id: 'PROD-003', name: 'Luxury Hotel Stay Voucher', price: 180000, stock: 0, primaryCategory: 'Sports & Fitness', subCategory: 'Outdoor Gear', status: 'Out of Stock', imageUrl: 'https://i.pravatar.cc/150?img=33', aiEnabled: true, dateAdded: '2025-09-10', description: 'One-night stay at a luxury hotel.' },
    { id: 'PROD-004', name: 'Gaming Laptop RTX 4080', price: 1500000, stock: 5, primaryCategory: 'Laptops & PCs', subCategory: 'Gaming Laptops', status: 'Active', imageUrl: 'https://i.pravatar.cc/150?img=12', aiEnabled: true, dateAdded: '2025-09-15', description: 'Latest generation gaming laptop with top specs.' },
];