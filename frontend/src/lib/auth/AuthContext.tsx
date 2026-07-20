"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { login as loginRequest, me as fetchMe } from "@/lib/api/auth";
import { clearToken, getToken, setToken } from "@/lib/auth/token";
import type { AuthUser } from "@/lib/types/auth";

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
		let active = true;

		// 세션 복원: 저장된 토큰이 실제로 유효한지 백엔드에 확인한 뒤에만 인증으로 인정.
		// (localStorage user만 믿고 통과시키면 만료·무효 토큰으로도 로그인 화면을 건너뛰는 버그가 발생)
		const token = getToken();
		Promise.resolve(token ? fetchMe() : null)
			.then((u) => {
				if (active) setUser(u);
			})
			.catch(() => {
				// 만료/무효 토큰 → 세션 정리 후 미인증 상태로
				if (active) {
					clearToken();
					setUser(null);
				}
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		const handleUnauthorized = () => {
			clearToken();
			setUser(null);
		};
		window.addEventListener("tp-hr:unauthorized", handleUnauthorized);
		return () => {
			active = false;
			window.removeEventListener("tp-hr:unauthorized", handleUnauthorized);
		};
	}, []);

	async function login(email: string, password: string) {
		const response = await loginRequest(email, password);
		setToken(response.accessToken);
		setUser({
			employeeId: response.employeeId,
			employeeNumber: response.employeeNumber,
			name: response.name,
			email: response.email,
			role: response.role,
		});
	}

	function logout() {
		clearToken();
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
