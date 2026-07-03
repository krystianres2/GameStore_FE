import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = 'http://localhost:5001';

// 1. Add signup to the interface
interface AuthState {
    user: { email: string } | null;
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    
    signup: (email: string, password: string) => Promise<void>; // <-- ADD THIS
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,

            // 2. Add the signup implementation
            signup: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    // Call your .NET Identity register endpoint
                    await axios.post(`${API_URL}/identity/register`, { email, password });
                    
                    // We don't set isAuthenticated: true here because your component 
                    // redirects them to /login to log in manually after signing up!
                    set({ isLoading: false });
                } catch (error: any) {
                    // .NET Identity validation errors often come back in an 'errors' array or 'message' string
                    set({ error: error.response?.data?.errors || error.response?.data?.message || "Error signing up", isLoading: false });
                    throw error;
                }
            },

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    await axios.post(`${API_URL}/identity/login?useCookies=true&useSessionCookies=true`, 
                        { email, password }, 
                        { withCredentials: true } 
                    );
                    
                    set({
                        user: { email }, 
                        isAuthenticated: true,
                        error: null,
                        isLoading: false,
                    });
                    console.log("Login successful");
                } catch (error: any) {
                    set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
                    throw error;
                }
            },
            
            logout: () => {
                set({ 
                    user: null, 
                    isAuthenticated: false, 
                    error: null, 
                    isLoading: false 
                });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                user: state.user, 
                isAuthenticated: state.isAuthenticated 
            }),
        }
    )
);