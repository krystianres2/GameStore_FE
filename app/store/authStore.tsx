import { create } from "zustand";
import axios from "axios";

const API_URL = 'http://localhost:5001';

interface AuthState {
    user: { email: string } | null; // Typed it slightly better than 'any' for you
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    
    signup: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signup: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/identity/register`, { email, password });
            
            // Optional: If you want auto-login on signup, set the user here too.
            // If they need to log in separately after signup, leave user: null.
            set({ 
                user: { email }, // Update user here if auto-logging in
                isAuthenticated: true, 
                isLoading: false 
            });
        } catch (error: any) {
            set({ error: error.response?.data?.errors || "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/identity/login?useCookies=true&useSessionCookies=true`, { email, password }, { withCredentials: true });
            
            set({
                user: { email }, // <--- THE FIX: We must update the user object!
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
}));