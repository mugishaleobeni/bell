// src/services/seller.api.ts

import axiosInstance from '@/services/axiosInstance'; // Assuming you have this configured
import { 
    SellerProduct, 
    NewProductFormValues, 
    EditProductFormValues 
} from '@/utils/sellerDashboard.utils';

const API_URL = '/products'; // Corresponds to /api/products in your Flask app

// 1. READ: Fetch all products for the authenticated seller
export const fetchSellerProductsApi = async (): Promise<SellerProduct[]> => {
    // The sellerId is handled automatically by the backend via the JWT token (g.seller_id)
    const response = await axiosInstance.get<SellerProduct[]>(API_URL);
    
    // IMPORTANT: Map the MongoDB _id to your frontend's 'id' field
    // Your backend JSON encoder returns _id as a string.
    return response.data.map(product => ({
        ...product,
        id: product._id, // Assume backend provides '_id' as a string
    }));
};

// 2. CREATE: Submit a new product
export const createProductApi = async (data: NewProductFormValues, imageUrl: string | null): Promise<SellerProduct> => {
    const payload = {
        ...data,
        imageUrl: imageUrl, // Null or string
        // The sellerId is added on the backend by the @seller_required decorator
    };
    const response = await axiosInstance.post<SellerProduct>(API_URL, payload);
    
    // IMPORTANT: Map the MongoDB _id to your frontend's 'id' field
    return {
        ...response.data,
        id: response.data._id,
    };
};

// 3. UPDATE: Edit an existing product
export const updateProductApi = async (productId: string, data: EditProductFormValues, imageUrl: string | null): Promise<SellerProduct> => {
    const payload = {
        ...data,
        imageUrl: imageUrl,
        // The backend ensures ownership via the JWT
    };
    // Note the dynamic URL: /api/products/<productId>
    const response = await axiosInstance.patch<SellerProduct>(`${API_URL}/${productId}`, payload);
    
    // IMPORTANT: Map the MongoDB _id to your frontend's 'id' field
    return {
        ...response.data,
        id: response.data._id,
    };
};

// 4. DELETE: Remove a product
export const deleteProductApi = async (productId: string): Promise<void> => {
    // The backend handles security/ownership
    await axiosInstance.delete(`${API_URL}/${productId}`);
    // No content is returned (204 No Content expected)
};