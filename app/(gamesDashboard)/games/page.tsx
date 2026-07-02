"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:5001";

interface Game {
  id: number;
  name: string;
  genre: string;
  price: number;
  releaseDate: string;
  imageId: number | null;
}

export default function GamesDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGames() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/games`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load games: ${response.status}`);
        }

        const data = (await response.json()) as Game[];
        setGames(data);
      } catch (fetchError) {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Error while loading games",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadGames();

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen theme-bg px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 space-y-3">
          <p
            className="text-sm uppercase tracking-[0.3em] font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            Games dashboard
          </p>
          <h1 className="text-4xl font-extrabold sm:text-5xl text-gradient pb-2">
            Available Games
          </h1>
        </div>

        {/* Content Section */}
        {isLoading ? (
          /* Elegant Skeleton Loader */
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="theme-card rounded-2xl p-6 h-64 animate-pulse flex flex-col"
              >
                <div className="space-y-4 flex-1">
                  <div className="h-7 bg-slate-700/50 rounded-md w-3/4"></div>
                  <div className="h-4 bg-slate-700/50 rounded-md w-1/3"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="h-16 bg-slate-700/30 rounded-xl"></div>
                  <div className="h-16 bg-slate-700/30 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div
            className="rounded-xl border p-6 shadow-lg flex items-center gap-4"
            style={{
              backgroundColor: "var(--color-error-bg)",
              borderColor: "var(--color-error-text)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-current"
              style={{ color: "var(--color-error-text)" }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span
              className="font-medium"
              style={{ color: "var(--color-error-text)" }}
            >
              {error}
            </span>
          </div>
        ) : (
          /* Data Grid */
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => (
                <Link href={`/games/${game.id}`} key={game.id} className="block group">
              <article
                key={game.id}
                className="theme-card rounded-2xl overflow-hidden flex flex-col group relative"
              >
                {/* Fixed Top Banner/Image Area */}
                <div
                  className="relative w-full shrink-0 overflow-hidden border-b border-slate-700/50 bg-slate-800/50"
                  style={{
                    height: "12rem",
                  }} /* Hardcoded height to stop layout blowouts */
                >
                  {game.imageId ? (
                    <img
                      src={`${API_URL}/images/${game.imageId}.jpg`}
                      alt={`${game.name} cover`}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                      {/* Hardcoded width and height attributes on the SVG */}
                      <svg
                        width="32"
                        height="32"
                        className="mb-2 opacity-20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 15.999a2 2 0 01-2 2H5a2 2 0 01-2-2v-7.999a2 2 0 012-2h14a2 2 0 012 2v7.999zM19 15.999v-7.999H5v7.999h14zM8 10a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zM6 12a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm6 0h2v2h-2v-2zm-2 2h2v2h-2v-2z" />
                      </svg>
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        No Cover Found
                      </span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[var(--color-card-bg)] to-transparent opacity-90"></div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col z-10 -mt-6 relative">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">
                        {game.name}
                      </h2>
                      <p
                        className="text-sm font-medium mt-1"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {game.genre}
                      </p>
                    </div>
                    <span className="theme-badge px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      #{game.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="theme-stat-box rounded-xl p-3 text-center">
                      <p
                        className="text-xs uppercase tracking-widest mb-1 font-semibold"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Price
                      </p>
                      <p className="text-lg font-bold">
                        {game.price === 0 ? (
                          <span style={{ color: "var(--color-accent)" }}>
                            Free
                          </span>
                        ) : (
                          `${game.price.toFixed(2)} PLN`
                        )}
                      </p>
                    </div>
                    <div className="theme-stat-box rounded-xl p-3 text-center">
                      <p
                        className="text-xs uppercase tracking-widest mb-1 font-semibold"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Released
                      </p>
                      <p className="text-sm font-bold mt-1.5">
                        {game.releaseDate}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
