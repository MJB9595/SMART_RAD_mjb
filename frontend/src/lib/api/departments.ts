import { apiFetch } from "@/lib/api/client";
import type { Department, DepartmentTree } from "@/lib/types/department";

export function listDepartments(): Promise<Department[]> {
	return apiFetch<Department[]>("/departments");
}

export function getDepartmentTree(): Promise<DepartmentTree[]> {
	return apiFetch<DepartmentTree[]>("/departments/tree");
}
