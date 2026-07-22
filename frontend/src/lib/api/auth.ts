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

export interface PendingSignup {
	id: number;
	name: string;
	email: string;
	school: string;
	requestedAt: string;
}

export interface SignupBody {
	name: string;
	email: string;
	password: string;
	school: string;
}

/** 회원가입 신청 (공개). 관리자 승인 후 로그인 가능. */
export function signup(body: SignupBody): Promise<void> {
	return apiFetch<void>("/auth/signup", { method: "POST", body });
}

/** 승인 대기 목록 (관리자). */
export function getPendingSignups(): Promise<PendingSignup[]> {
	return apiFetch<PendingSignup[]>("/auth/signups/pending");
}

/** 승인 = 신청건 ↔ 자리(슬롯) 매칭 → 로그인 가능한 교직원 계정 생성 (관리자). */
export function approveSignup(id: number, slotId: number): Promise<void> {
	return apiFetch<void>(`/auth/signups/${id}/approve`, { method: "POST", body: { slotId } });
}

/** 거절 (관리자). */
export function rejectSignup(id: number): Promise<void> {
	return apiFetch<void>(`/auth/signups/${id}/reject`, { method: "POST" });
}
