// src/api/productsApi.ts

import { NewProductFormValues } from '@/utils/sellerDashboard.utils';

// Replace this with your actual environment variable for the base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://beltrandsmarketbackend.onrender.com/api'; 

/**
 * Creates a product draft on the server.
 * @param productData - The validated form data.
 * @param token - The seller's JWT token required for authorization.
 */
export async function createProductDraft(productData: NewProductFormValues, token: string) {
    
    // Check if the token is present
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    const response = await fetch(`${API_BASE_URL}/products/draft`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 🛑 CRITICAL FIX: Include the Authorization header 🛑
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(productData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Error Response:", errorText);
        // Throw a custom error that SellPage can catch
        throw new Error(`POST Draft failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}