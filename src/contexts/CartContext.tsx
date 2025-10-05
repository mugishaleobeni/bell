// File: src/contexts/CartContext.tsx
// FIX: Corrected API parameter names in updateCartItemQuantity and improved error handling.

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext'; 
import { toast } from 'sonner';

// Define the API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://beltrandsmarketbackend.onrender.com';

// --- Types ---
interface CartItem {
    _id: string; 
    product_id: string; 
    quantity: number;
    name: string; 
    price: number;
    image: string;
    seller: string; 
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    isLoading: boolean;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    fetchCartItems: () => Promise<void>;
    updateCartItemQuantity: (itemId: string, newQuantity: number) => Promise<void>;
    removeCartItem: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Hook ---
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// --- Helper function to get clean token ---
const getToken = () => {
    const token = localStorage.getItem('authToken');
    return token ? token.trim() : null;
};

// --- Cart Provider Component ---
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn } = useAuth(); 
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // ----------------------------------------------------
    // 1. FETCH CART ITEMS (GET /api/cart)
    // ----------------------------------------------------
    const fetchCartItems = useCallback(async () => {
        if (!isLoggedIn) { 
            setCartItems([]);
            return;
        }
        
        const token = getToken();
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items || []); 
            } else if (response.status === 401) {
                setCartItems([]);
                toast.error("Session expired. Please log in.");
            } else {
                toast.error("Failed to fetch cart contents.");
            }
        } catch (error) {
            toast.error("Network error fetching cart.");
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn]);


    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]); 


    // ----------------------------------------------------
    // 2. ADD TO CART (POST /api/cart/add)
    // ----------------------------------------------------
    const addToCart = useCallback(async (productId: string, quantity: number) => {
        const token = getToken();
        if (!token) {
            toast.warning("Please log in to add items to your cart.");
            return;
        }

        const validatedQuantity = Number(Math.max(1, Math.floor(quantity))); 

        setIsLoading(true);
        try {
            const requestBody = { product_id: productId, quantity: validatedQuantity };
            
            const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                toast.success("Product added to cart!");
                await fetchCartItems();
            } else {
                const errorText = await response.text(); 
                console.error(`Failed to add product (Status: ${response.status}):`, errorText);
                
                try {
                    const errorData = JSON.parse(errorText);
                    toast.error(`Failed to add: ${errorData.msg || errorData.message || 'Server Error'}`);
                } catch {
                    toast.error(`Failed to add: Server returned status ${response.status}. Check console.`);
                }
            }
        } catch (error) {
            console.error("Add to Cart Network/Fetch Error:", error);
            toast.error("Network error adding to cart.");
        } finally {
            setIsLoading(false);
        }
    }, [fetchCartItems]);


    // ----------------------------------------------------
    // 3. REMOVE ITEM (DELETE /api/cart/remove/<product_id>)
    // ----------------------------------------------------
    const removeCartItem = useCallback(async (itemId: string) => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/remove/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Success message handled by Cart.tsx component, just update the list
                await fetchCartItems();
            } else {
                const errorText = await response.text(); 
                console.error(`Failed to remove item (Status: ${response.status}):`, errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    toast.error(`Remove failed: ${errorData.msg || errorData.message || 'Server Error'}`);
                } catch {
                    toast.error(`Failed to remove item: Server status ${response.status}.`);
                }
            }
        } catch (error) {
            toast.error("Network error removing item.");
        }
    }, [fetchCartItems]);


    // ----------------------------------------------------
    // 4. UPDATE QUANTITY (PUT /api/cart/update)
    // ----------------------------------------------------
    const updateCartItemQuantity = useCallback(async (itemId: string, newQuantity: number) => {
        const token = getToken();
        
        const validatedQuantity = Number(Math.max(0, Math.floor(newQuantity))); 
        
        if (!token || validatedQuantity < 0) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                // FIX: Use 'product_id' to match the Flask route parameter
                body: JSON.stringify({ product_id: itemId, quantity: validatedQuantity }), 
            });

            if (response.ok) {
                // If quantity was updated to 0 or less, the backend removes it,
                // so we just refresh the cart.
                await fetchCartItems(); 
                if (validatedQuantity > 0) {
                    // Only show success toast if item was updated, not removed/failed
                    toast.success("Quantity updated successfully!");
                }
            } else {
                const errorText = await response.text(); 
                console.error(`Failed to update quantity (Status: ${response.status}):`, errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    toast.error(`Update failed: ${errorData.msg || errorData.message || 'Server Error'}`);
                } catch {
                    toast.error(`Failed to update quantity: Server status ${response.status}.`);
                }
            }
        } catch (error) {
            toast.error("Network error updating quantity.");
        }
    }, [fetchCartItems]);

    // Memoize the context value
    const contextValue = useMemo(() => ({
        cartItems,
        cartCount,
        isLoading,
        addToCart,
        fetchCartItems,
        updateCartItemQuantity,
        removeCartItem,
    }), [cartItems, cartCount, isLoading, addToCart, fetchCartItems, updateCartItemQuantity, removeCartItem]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};