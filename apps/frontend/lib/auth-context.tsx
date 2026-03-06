"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { API_BASE_URL } from "@/lib/api";

interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    image?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithToken: (user: User, accessToken: string) => void;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const clearAuth = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("apiscout_user");
    }, []);

    // Validate session on mount by calling /auth/me
    useEffect(() => {
        const savedUser = localStorage.getItem("apiscout_user");

        // Optimistic restore from localStorage for instant UI
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("apiscout_user");
            }
        }

        // Validate against the server (cookie is sent automatically)
        fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setToken("cookie");
                    localStorage.setItem("apiscout_user", JSON.stringify(data));
                } else {
                    // Access token may have expired — try refreshing
                    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
                        method: "POST",
                        credentials: "include",
                    });
                    if (refreshRes.ok) {
                        // Refresh succeeded — retry /auth/me
                        const meRes = await fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" });
                        if (meRes.ok) {
                            const data = await meRes.json();
                            setUser(data);
                            setToken("cookie");
                            localStorage.setItem("apiscout_user", JSON.stringify(data));
                            return;
                        }
                    }
                    clearAuth();
                }
            })
            .catch(() => {
                // Network error — keep optimistic state, don't clear
            })
            .finally(() => setIsLoading(false));
    }, [clearAuth]);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || "Invalid credentials");
        }

        const data = await res.json();
        setUser(data.user);
        setToken(data.access_token);
        localStorage.setItem("apiscout_user", JSON.stringify(data.user));
    };

    const loginWithToken = (userData: User, accessToken: string) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem("apiscout_user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // Best-effort — clear local state even if request fails
        }
        clearAuth();
    };

    const refreshProfile = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                localStorage.setItem("apiscout_user", JSON.stringify(data));
            }
        } catch {
            // Silently fail — profile will update on next page load
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, loginWithToken, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
