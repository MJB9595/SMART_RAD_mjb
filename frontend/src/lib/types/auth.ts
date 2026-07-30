import type { EmployeeRole } from "@/lib/types/employee";

export interface LoginResponse {
	accessToken: string;
	tokenType: string;
	employeeId: number;
	employeeNumber: string;
	name: string;
	email: string;
	role: EmployeeRole;
	positionLevel: number | null;
	departmentId: number | null;
	departmentName: string | null;
	/** 활성 역할로부터 계산된 권한 코드. 메뉴·버튼 노출 판단의 근거. */
	permissions: string[];
}

export type AuthUser = Omit<LoginResponse, "accessToken" | "tokenType">;

/** 카카오 로그인 결과. LOGGED_IN이면 login으로 토큰 적용, PENDING_APPROVAL이면 message 안내. */
export interface KakaoLoginResult {
	status: "LOGGED_IN" | "PENDING_APPROVAL";
	login: LoginResponse | null;
	message: string | null;
}
