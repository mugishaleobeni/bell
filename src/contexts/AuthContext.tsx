// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// // Define the shape of your User data (must match your backend)
// interface UserProfile {
//     id: string;
//     name: string;
//     email: string;
//     role: 'buyer' | 'Seller' | 'both'; 
//     sellerId?: string; 
//     profileImageUrl?: string; 
// }

// // Define the shape of the Context
// interface AuthContextType {
//     user: UserProfile | null;
//     isLoggedIn: boolean;
//     isLoading: boolean;
//     login: (token: string) => Promise<void>;
//     logout: () => void;
//     getAccessToken: () => string; 
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Define the API endpoint to fetch user data (REPLACE WITH YOUR ACTUAL ENDPOINT)
// const USER_INFO_ENDPOINT = 'http://127.0.0.1:5000/api/user/me'; 

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<UserProfile | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const isLoggedIn = !!user;

//     // ------------------------------------------------------------------
//     // 🌟 Get Token Function 🌟
//     // ------------------------------------------------------------------
//     const getAccessToken = useCallback(() => {
//         return localStorage.getItem('authToken') || '';
//     }, []);


//     // ------------------------------------------------------------------
//     // 🌟 CORE DATA FETCHING LOGIC 🌟
//     // ------------------------------------------------------------------
//     const fetchUser = useCallback(async (token: string) => {
//         if (!token) {
//             setUser(null);
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const response = await fetch(USER_INFO_ENDPOINT, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 const userData: UserProfile = await response.json();
//                 setUser(userData); 
//             } else {
//                 // Token invalid or expired, OR JSON parsing failed
//                 console.error("Failed to fetch user data, preventing auto-logout for debugging.");
                
//                 // 🛑 TEMPORARY CHANGE: COMMENTED OUT TO PREVENT REDIRECT LOOP 🛑
//                 // localStorage.removeItem('authToken'); 
                
//                 setUser(null);
//             }
//         } catch (error) {
//             console.error("Error fetching user data:", error);
//             setUser(null);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     // ------------------------------------------------------------------
//     // 🌟 INITIAL LOAD & PERSISTENCE 🌟
//     // ------------------------------------------------------------------
//     useEffect(() => {
//         const token = getAccessToken();
//         fetchUser(token);
//     }, [fetchUser, getAccessToken]);


//     // ------------------------------------------------------------------
//     // 🌟 AUTH ACTIONS 🌟
//     // ------------------------------------------------------------------
//     const login = async (token: string) => {
//         localStorage.setItem('authToken', token);
//         setIsLoading(true);
//         await fetchUser(token);
//     };

//     const logout = () => {
//         localStorage.removeItem('authToken');
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider 
//             value={{ 
//                 user, 
//                 isLoggedIn, 
//                 isLoading, 
//                 login, 
//                 logout,
//                 getAccessToken
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // ------------------------------------------------------------------
// // 🌟 CUSTOM HOOK TO USE CONTEXT 🌟
// // ------------------------------------------------------------------
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Define the shape of your User data (must match your backend)
interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'buyer' | 'Seller' | 'both'; 
    sellerId?: string; 
    profileImageUrl?: string; 
}

// Define the shape of the Context
interface AuthContextType {
    user: UserProfile | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    getAccessToken: () => string; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the API endpoint to fetch user data (REPLACE WITH YOUR ACTUAL ENDPOINT)
// NOTE: Use environment variable here for production safety
const USER_INFO_ENDPOINT = 'https://beltrandsmarketbackend.onrender.com/api/user/me'; 

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    // 🌟 FIX 1: Add a dedicated state for the token 🌟
    // This makes sure React tracks the token change immediately.
    const [tokenState, setTokenState] = useState(localStorage.getItem('authToken'));
    
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // isLoggedIn is derived from the user object, which is correct
    const isLoggedIn = !!user; 

    // ------------------------------------------------------------------
    // 🌟 Get Token Function 🌟
    // ------------------------------------------------------------------
    const getAccessToken = useCallback(() => {
        // Now returns the token from state OR local storage as a fallback
        return tokenState || localStorage.getItem('authToken') || '';
    }, [tokenState]);


    // ------------------------------------------------------------------
    // 🌟 CORE DATA FETCHING LOGIC 🌟
    // ------------------------------------------------------------------
    const fetchUser = useCallback(async (token: string) => {
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(USER_INFO_ENDPOINT, {
                method: 'GET',
                headers: {
                    // FIX: Ensure the token is trimmed and clean when sent to the backend
                    'Authorization': `Bearer ${token.trim()}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData: UserProfile = await response.json();
                setUser(userData); 
            } else {
                console.error("Failed to fetch user data. Status:", response.status);
                // If token is bad/expired, clear it and user state
                localStorage.removeItem('authToken'); 
                setTokenState(null); // Clear token state on failure
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            localStorage.removeItem('authToken');
            setTokenState(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ------------------------------------------------------------------
    // 🌟 INITIAL LOAD & PERSISTENCE 🌟
    // ------------------------------------------------------------------
    useEffect(() => {
        // 🌟 FIX 2: Depend on tokenState. This runs whenever the token changes 
        // (after login/logout/initial load)
        if (tokenState) {
            fetchUser(tokenState);
        } else {
             // If tokenState is null (initial load and no token found), stop loading
             setUser(null);
             setIsLoading(false);
        }
        
    }, [tokenState, fetchUser]); // Rerun when tokenState changes

    // ------------------------------------------------------------------
    // 🌟 AUTH ACTIONS 🌟
    // ------------------------------------------------------------------
    const login = async (token: string) => {
        const cleanToken = token.trim(); // Ensure the input token is clean
        localStorage.setItem('authToken', cleanToken);
        
        // 🌟 CRITICAL FIX 3: Update the state immediately 🌟
        // This triggers the useEffect above to fetch the user data.
        setTokenState(cleanToken); 
        
        setIsLoading(true);
        // await fetchUser(cleanToken); // The useEffect hook now handles the fetch
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        // 🌟 CRITICAL FIX 4: Clear the state immediately 🌟
        setTokenState(null); 
        setUser(null);
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                isLoggedIn, 
                isLoading, 
                login, 
                logout,
                getAccessToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ------------------------------------------------------------------
// 🌟 CUSTOM HOOK TO USE CONTEXT 🌟
// ------------------------------------------------------------------
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};