"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { LogOut, User, Gamepad2 } from "lucide-react"; // Imported Gamepad2

export default function Navbar() {
    const { isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login"); 
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                
                {/* Brand / Logo with SVG */}
                <Link 
                    href="/games" 
                    className="group flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                    {/* The SVG Logo */}
                    <div 
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-105"
                    >
                        <Gamepad2 size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    
                    {/* The Text Logo */}
                    <span className="text-2xl font-extrabold tracking-tighter text-white">
                        Game<span style={{ color: 'var(--color-primary)' }}>Store</span>
                    </span>
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:from-green-600 hover:to-emerald-700"
                        >
                            <User size={16} />
                            Login
                        </Link>
                    )}
                </div>
                
            </div>
        </nav>
    );
}