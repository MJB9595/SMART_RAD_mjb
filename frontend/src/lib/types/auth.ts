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
