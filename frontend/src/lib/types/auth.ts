import type { EmployeeRole } from "@/lib/types/employee";

export interface LoginResponse {
	accessToken: string;
	tokenType: string;
	employeeId: number;
	employeeNumber: string;
	name: string;
	email: string;
	role: EmployeeRole;
}

export type AuthUser = Omit<LoginResponse, "accessToken" | "tokenType">;

/** 카카오 로그인 결과. LOGGED_IN이면 login으로 토큰 적용, PENDING_APPROVAL이면 message 안내. */
export interface KakaoLoginResult {
	status: "LOGGED_IN" | "PENDING_APPROVAL";
	login: LoginResponse | null;
	message: string | null;
}
