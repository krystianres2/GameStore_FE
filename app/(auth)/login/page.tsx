"use client";
import { useState } from "react";
import Input from "@/app/components/Input";
import { Mail, Lock, Loader } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuthStore();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex
  items-center justify-center relative overlow-hidden"
    >
      <div
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
      >
        <div className="p-8">
          <h2
            className="text-3x-1 font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500
        text-transparent bg-clip-text"
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
            ></Input>
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <div className="flex items-center mb-6">
              <Link href={"/forgot-password"} className="text-sm text-green-400 hover:underline">
                Forgot your password?
              </Link>
            </div>
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
            <button
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              Login
              {isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
