import { apiFetch } from "@/lib/api/client";
import type { LoginResponse } from "@/lib/types/auth";

export function login(email: string, password: string): Promise<LoginResponse> {
	return apiFetch<LoginResponse>("/auth/login", {
		method: "POST",
		body: { email, password },
	});
}
