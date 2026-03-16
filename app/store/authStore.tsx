import {create} from "zustand";
import axios from "axios";
import { error } from "console";

const API_URL = 'http://localhost:5001';

export const useAuthStore = create((set) => ({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,

    signup: async(email:string, password:string) => {
        set({isLoading:true, error:null});
        try{
            // Zwracaj usera z BE
            await axios.post(`${API_URL}/register`, { email, password })
            set({isAuthenticated:true, isLoading:false});
        }catch (error:any){
            set({error: error.response.data.errors || "Error signing up", isLoading:false});
            throw error
        }
    },

    login: async (email:string, password:string) =>{
        set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/login?useCookies=true&useSessionCookies=true`, { email, password }, { withCredentials: true });
			set({
				isAuthenticated: true,
				// user: response.data.user,
				error: null,
				isLoading: false,
			});
            console.log("Login successful");
		} catch (error:any) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
    },
    
    logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error:any) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	}

    // checkAuth: async () => {
    //     set({isCheckingAuth:true, error:null});
    //     try{
    //         const response = await
    //     }catch (error){}
    // }
}))