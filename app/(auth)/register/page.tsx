"use client";

import { useState } from "react";
import Input from "@/app/components/Input";
import { Mail, Lock, Loader, CheckCircle } from "lucide-react"; // Imported CheckCircle
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 1. Add a success state
  const [isSuccess, setIsSuccess] = useState(false); 
  
  const { signup, error, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password);
      
      // 2. Set success to true to show the alert
      setIsSuccess(true);
      
      // 3. Delay the redirect so they can see the message
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Register
          </h2>
          
          <form onSubmit={handleSignUp}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {/* --- NEW: Success Alert --- */}
            {isSuccess && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400 text-sm font-medium">
                <CheckCircle size={20} className="text-green-500" />
                Account created successfully! Redirecting...
              </div>
            )}

            {/* Error Alert */}
            {error && !isSuccess && (
              <p className="text-red-500 font-semibold mt-2">{error}</p>
            )}
            
            <button
              className="mt-5 w-full py-3 px-4 flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              // Disable button if loading OR if it was already successful
              disabled={isLoading || isSuccess} 
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
        
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">Already have an account? </p>
          <Link href={"/login"} className="ml-2 text-green-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}