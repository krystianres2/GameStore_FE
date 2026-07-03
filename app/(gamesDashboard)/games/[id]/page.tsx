"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore"; // Added to get user email

const API_URL = "http://localhost:5001";

interface GameDetail {
    id: number;
    name: string;
    genreId: number;
    price: number;
    releaseDate: string;
    imageId: number | null;
}

export default function GameDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    // Pull user from auth store to get the email for the buy payload
    const { user, isAuthenticated } = useAuthStore();

    const [game, setGame] = useState<GameDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New states for the buying process
    const [isBuying, setIsBuying] = useState(false);
    const [buyMessage, setBuyMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();

        async function loadGame() {
            try {
                setIsLoading(true);
                setError(null);
                 console.log("Current user state:", user);

                const response = await fetch(`${API_URL}/games/${id}`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Game not found.");
                    }
                    throw new Error(`Failed to load game: ${response.status}`);
                }

                const data = (await response.json()) as GameDetail;
                setGame(data);
            } catch (fetchError) {
                if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
                    return;
                }
                setError(fetchError instanceof Error ? fetchError.message : "Error while loading game");
            } finally {
                setIsLoading(false);
            }
        }

        loadGame();

        return () => controller.abort();
    }, [id]);

    // Handle the Buy Action
    const handleBuy = async () => {
        if (!game) return;
        
        if (!isAuthenticated) {
            setBuyMessage({ type: 'error', text: "You must be logged in to buy a game." });
            return;
        }

        setIsBuying(true);
        setBuyMessage(null);

       try {
        const payload = {
            gameId: game.id,
            price: game.price,
            userEmail: user?.email || "user@example.com" 
        };

        const response = await fetch(`${API_URL}/orders/buy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to process the order. Please try again.");
        }

        // 1. Parse the response to get the newly created orderId
        const data = await response.json();
        const newOrderId = data.orderId;

        setBuyMessage({ type: 'success', text: "Order placed! Redirecting..." });
        
        // 2. Redirect to the new status page
        setTimeout(() => router.push(`/orders/${newOrderId}`), 1000);

    } catch (err) {
            setBuyMessage({ 
                type: 'error', 
                text: err instanceof Error ? err.message : "An unexpected error occurred." 
            });
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <main className="min-h-screen theme-bg px-6 py-12">
            <div className="mx-auto max-w-4xl">
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>

                {isLoading ? (
                    <div className="theme-card rounded-2xl p-8 h-96 animate-pulse"></div>
                ) : error ? (
                    <div className="rounded-xl border p-6 shadow-lg flex items-center gap-4" style={{ backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error-text)' }}>
                        <span className="font-medium" style={{ color: 'var(--color-error-text)' }}>{error}</span>
                    </div>
                ) : game ? (
                    <div className="theme-card rounded-3xl overflow-hidden shadow-2xl">
                        {/* Header Image Area */}
                        <div className="relative h-72 w-full bg-slate-800 flex items-center justify-center border-b border-slate-700/50">
                            {game.imageId ? (
                                <img 
                                    src={`${API_URL}/images/${game.imageId}.jpg`} 
                                    alt={`${game.name} cover`}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            ) : (
                                <div className="text-center opacity-30">
                                    <svg width="48" height="48" className="mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 15.999a2 2 0 01-2 2H5a2 2 0 01-2-2v-7.999a2 2 0 012-2h14a2 2 0 012 2v7.999zM19 15.999v-7.999H5v7.999h14zM8 10a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zM6 12a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm6 0h2v2h-2v-2zm-2 2h2v2h-2v-2z" />
                                    </svg>
                                    <span className="font-mono text-sm">No Cover</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card-bg)] to-transparent opacity-90"></div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 relative -mt-12 z-10">
                            <span className="theme-badge px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">
                                ID: #{game.id} | Genre ID: {game.genreId}
                            </span>
                            <h1 className="text-4xl font-extrabold mb-8">{game.name}</h1>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="theme-stat-box rounded-2xl p-6">
                                    <p className="text-sm uppercase tracking-widest mb-2 font-semibold" style={{ color: 'var(--color-text-muted)' }}>Price</p>
                                    <p className="text-3xl font-bold">
                                        {game.price === 0 ? (
                                            <span style={{ color: 'var(--color-accent)' }}>Free</span>
                                        ) : (
                                            `${game.price.toFixed(2)} PLN`
                                        )}
                                    </p>
                                </div>
                                <div className="theme-stat-box rounded-2xl p-6">
                                    <p className="text-sm uppercase tracking-widest mb-2 font-semibold" style={{ color: 'var(--color-text-muted)' }}>Release Date</p>
                                    <p className="text-2xl font-bold mt-1.5">{game.releaseDate}</p>
                                </div>
                            </div>

                            {/* Buy Action Section */}
                            <div className="flex flex-col gap-4 border-t border-slate-700/50 pt-8">
                                <button
                                    onClick={handleBuy}
                                    disabled={isBuying}
                                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-green-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isBuying ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={24} />
                                            Buy Now for {game.price === 0 ? "Free" : `${game.price.toFixed(2)} PLN`}
                                        </>
                                    )}
                                </button>

                                {/* Buy Status Messages */}
                                {buyMessage && (
                                    <div 
                                        className={`rounded-lg p-4 text-center text-sm font-medium ${
                                            buyMessage.type === 'success' 
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}
                                    >
                                        {buyMessage.text}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </main>
    );
}