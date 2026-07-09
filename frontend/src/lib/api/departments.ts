import { apiFetch } from "@/lib/api/client";
import type { Department } from "@/lib/types/department";

export function listDepartments(): Promise<Department[]> {
	return apiFetch<Department[]>("/departments");
}
