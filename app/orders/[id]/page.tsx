"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const API_URL = "http://localhost:5001";

interface OrderStatusResponse {
    status: string;
}

export default function OrderStatusPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id;

    const [status, setStatus] = useState<string>("Pending payment");
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) return;

        let isMounted = true;
        let pollInterval: NodeJS.Timeout;

        const checkStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
                    credentials: "include", 
                });

                if (!response.ok) throw new Error("Failed to fetch order status");

                const data = (await response.json()) as OrderStatusResponse;
                const currentStatus = data.status; 

                if (isMounted) {
                    setStatus(currentStatus);
                    setIsLoading(false);

                    if (currentStatus === "Finished" || currentStatus === "Cancelled") {
                        clearInterval(pollInterval);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error(err);
                    setError("Could not retrieve status. Retrying...");
                }
            }
        };

        checkStatus();
        pollInterval = setInterval(checkStatus, 3000);

        return () => {
            isMounted = false;
            clearInterval(pollInterval);
        };
    }, [orderId]);

    // --- NEW: Invoice Download Handler ---
    const handleDownloadInvoice = async () => {
        if (!orderId) return;
        
        try {
            setIsDownloading(true);
            setError(null); // Clear any previous errors
            
            const response = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
                method: "GET",
                credentials: "include", // Ensures auth cookies/tokens are sent if required
            });

            if (!response.ok) {
                throw new Error("Failed to generate or fetch the invoice.");
            }

            // Convert the response stream into a Blob (binary large object)
            const blob = await response.blob();
            
            // Create a temporary URL for the Blob
            const url = window.URL.createObjectURL(blob);
            
            // Create an invisible anchor element to trigger the download
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            // You can adjust the extension based on what your backend returns (e.g., .pdf)
            a.download = `Invoice_${orderId}.pdf`; 
            
            document.body.appendChild(a);
            a.click();
            
            // Cleanup the DOM and the object URL
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error("Download error:", err);
            setError("Could not download the invoice. Please try again later.");
        } finally {
            setIsDownloading(false);
        }
    };

    const isPending = status === "Pending payment";
    const isSuccess = status === "Finished";
    const isCancelled = status === "Cancelled";

    return (
        <main className="min-h-screen theme-bg flex items-center justify-center p-6">
            <div className="theme-card max-w-md w-full rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
                
                <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${
                    isPending ? 'bg-blue-500' : isSuccess ? 'bg-green-500' : 'bg-red-500'
                }`}></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-6">
                        {isLoading || isPending ? (
                            <div className="relative flex items-center justify-center w-24 h-24">
                                <Loader2 size={64} className="animate-spin text-blue-500 opacity-80" />
                                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                            </div>
                        ) : isSuccess ? (
                            <CheckCircle size={80} className="text-green-500" />
                        ) : (
                            <XCircle size={80} className="text-red-500" />
                        )}
                    </div>

                    <span className="theme-badge px-3 py-1 rounded-full text-xs font-bold mb-3">
                        Order #{orderId}
                    </span>
                    
                    <h1 className="text-3xl font-extrabold mb-2">
                        {isLoading ? "Checking Status..." : status}
                    </h1>

                    <p className="text-slate-400 mb-8">
                        {isPending && "Your payment is being processed in the background. Please do not close this page."}
                        {isSuccess && "Payment successful! Your invoice is ready."}
                        {isCancelled && "This order has been cancelled."}
                        {!isPending && !isSuccess && !isCancelled && "There was an issue processing your status."}
                    </p>

                    <div className="w-full space-y-3">
                        {isSuccess && (
                            <button 
                                onClick={handleDownloadInvoice}
                                disabled={isDownloading}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Downloading...
                                    </>
                                ) : (
                                    "Download Invoice"
                                )}
                            </button>
                        )}
                        
                        <button 
                            onClick={() => router.push('/games')}
                            className="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-xl font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                        >
                            <ArrowLeft size={18} />
                            Return to Store
                        </button>
                    </div>

                    {error && (
                        <p className="mt-4 text-sm text-red-400 font-medium">{error}</p>
                    )}
                </div>
            </div>
        </main>
    );
}