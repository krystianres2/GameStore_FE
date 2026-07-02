import { create } from "zustand";
import axios from "axios";

const API_URL = 'http://localhost:5001';

// 1. Define exactly what lives in your store
interface AuthState {
    user: any | null; // You can replace 'any' with a strict User type later!
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    
    // Define your functions
    signup: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void; 
}

// 2. Pass the <AuthState> interface to the create function
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
            set({ isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.errors || "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/identity/login?useCookies=true&useSessionCookies=true`, { email, password }, { withCredentials: true });
            set({
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
        // Soft logout: just wipe the frontend state instantly
        set({ 
            user: null, 
            isAuthenticated: false, 
            error: null, 
            isLoading: false 
        });
    }
}));