"use client";

import { useState } from "react";
import Input from "@/app/components/Input";
import { Mail, Lock, Loader } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation"; // 1. Import useRouter

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuthStore();
  const router = useRouter(); // 2. Initialize router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 3. Await login and redirect on success
      await login(email, password);
      router.push("/games"); 
    } catch (err) {
      // The error is already caught and set in the Zustand store, 
      // so we just catch it here to prevent unhandled promise rejections.
      console.error("Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      <div
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2
            className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text"
          >
            Welcome back
          </h2>
          <form onSubmit={handleLogin}>
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
            
            <div className="flex items-center mb-6">
              <Link href={"/forgot-password"} className="text-sm text-green-400 hover:underline">
                Forgot your password?
              </Link>
            </div>
            
            {error && <p className="text-red-500 font-semibold mt-2 mb-4">{error}</p>}
            
            <button
              className="mt-5 w-full py-3 px-4 flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {/* 4. Fixed button text rendering */}
              {isLoading ? (
                <Loader className="animate-spin" size={24} />
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}