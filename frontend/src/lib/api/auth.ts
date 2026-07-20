import { apiFetch } from "@/lib/api/client";
import type { AuthUser, LoginResponse } from "@/lib/types/auth";

export function login(email: string, password: string): Promise<LoginResponse> {
	return apiFetch<LoginResponse>("/auth/login", {
		method: "POST",
		body: { email, password },
	});
}

/** 저장된 토큰으로 현재 사용자 검증. 유효하지 않으면 401을 던진다. */
export function me(): Promise<AuthUser> {
	return apiFetch<AuthUser>("/auth/me");
}
