import {create} from "zustand";
import axios from "axios";

const API_URL = 'http://localhost:5001';

interface Genre {
    id: number;
    name: string
    imageId: number;
}

export const useGenresStore = create((set) => ({
    isLoading: false,
    error:null,
    genres: [] as Genre[],

    getGenres: async () =>{
        set({isLoading:true, error:null});

        try{
            const response = await axios.get(`${API_URL}/genres`);
            set({genres: response.data, isLoading: false});
        }catch (error:any){
            set({error: error.response.data.errors || "Error while loading", isLoading:false});
            throw error
        }
    }


}))