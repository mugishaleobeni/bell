// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you use axios for API calls

// --- Types ---

// Define the roles, matching your backend logic
type UserRole = 'anonymous' | 'buyer' | 'seller' | 'both'; 

interface User {
    id: string;
    email: string;
    role: UserRole;
    // Add other user fields you expect from /api/user/me
    sellerId?: string; 
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    userRole: UserRole;
}

// --- The Auth Hook ---

export const useAuth = (): AuthContextType => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Default to 'anonymous' until confirmed otherwise
    const userRole: UserRole = user?.role || 'anonymous';
    const isAuthenticated = !!user;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // IMPORTANT: Assumes your API call is secured (e.g., JWT token in cookies or Authorization header)
                const response = await axios.get<User>('/api/user/me'); 
                
                // If the request succeeds, the user is authenticated
                const userData = response.data;
                setUser(userData);
                
            } catch (error) {
                // 401 Unauthorized or any network error means no valid user session
                // The backend typically returns an error if no token is found
                console.log("No active session found or /api/user/me failed. Treating as anonymous.", error);
                setUser(null); // Explicitly set to null if the session is invalid
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []); // Run only once on mount to establish the initial auth state

    return {
        user,
        isLoading,
        isAuthenticated,
        userRole,
    };
};