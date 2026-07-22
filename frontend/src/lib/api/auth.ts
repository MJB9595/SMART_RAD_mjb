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
	id: string;
	name: string;
	email: string;
	school: string;
	requestedAt: string;
}

// 임시(Mock) 승인 대기자 데이터
let MOCK_PENDING_SIGNUPS: PendingSignup[] = [
	{ id: "1", name: "김선생", email: "kim@daehan.edu", school: "대한대학교", requestedAt: "2026-07-20" },
	{ id: "2", name: "이직원", email: "lee@mingook.edu", school: "민국고등학교", requestedAt: "2026-07-21" }
];

export async function getPendingSignups(): Promise<PendingSignup[]> {
	// 실제 환경이라면 apiFetch<PendingSignup[]>("/auth/pending-signups") 를 호출합니다.
	return new Promise((resolve) => {
		setTimeout(() => resolve([...MOCK_PENDING_SIGNUPS]), 500);
	});
}

export async function approveSignup(id: string): Promise<void> {
	// 실제 환경이라면 apiFetch(`/auth/signups/${id}/approve`, { method: "POST" }) 를 호출합니다.
	return new Promise((resolve) => {
		setTimeout(() => {
			MOCK_PENDING_SIGNUPS = MOCK_PENDING_SIGNUPS.filter(s => s.id !== id);
			resolve();
		}, 500);
	});
}

export async function rejectSignup(id: string): Promise<void> {
	// 실제 환경이라면 apiFetch(`/auth/signups/${id}/reject`, { method: "POST" }) 를 호출합니다.
	return new Promise((resolve) => {
		setTimeout(() => {
			MOCK_PENDING_SIGNUPS = MOCK_PENDING_SIGNUPS.filter(s => s.id !== id);
			resolve();
		}, 500);
	});
}
