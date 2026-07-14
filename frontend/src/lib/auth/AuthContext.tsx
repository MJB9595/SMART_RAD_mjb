"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { login as loginRequest } from "@/lib/api/auth";
import { clearToken, setToken } from "@/lib/auth/token";
import type { AuthUser } from "@/lib/types/auth";

const USER_KEY = "tp-hr:user";

interface AuthContextValue {
	user: AuthUser | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const stored = window.localStorage.getItem(USER_KEY);
		if (stored) {
			setUser(JSON.parse(stored) as AuthUser);
		}
		setLoading(false);

		const handleUnauthorized = () => {
			setUser(null);
			window.localStorage.removeItem(USER_KEY);
		};
		window.addEventListener("tp-hr:unauthorized", handleUnauthorized);
		return () => window.removeEventListener("tp-hr:unauthorized", handleUnauthorized);
	}, []);

	async function login(email: string, password: string) {
		const response = await loginRequest(email, password);
		const authUser: AuthUser = {
			employeeId: response.employeeId,
			employeeNumber: response.employeeNumber,
			name: response.name,
			email: response.email,
			role: response.role,
		};
		setToken(response.accessToken);
		window.localStorage.setItem(USER_KEY, JSON.stringify(authUser));
		setUser(authUser);
	}

	function logout() {
		clearToken();
		window.localStorage.removeItem(USER_KEY);
		setUser(null);
	}

	return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
	}
	return context;
}
