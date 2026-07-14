import { apiFetch } from "@/lib/api/client";
import type { Employee, Page } from "@/lib/types/employee";

export interface EmployeeSearchParams {
	keyword?: string;
	departmentId?: string;
	staffCategory?: string;
	employmentStatus?: string;
	size?: number;
}

export function searchEmployees(params: EmployeeSearchParams = {}): Promise<Page<Employee>> {
	const query = new URLSearchParams({ size: String(params.size ?? 50) });
	if (params.keyword) query.set("keyword", params.keyword);
	if (params.departmentId) query.set("departmentId", params.departmentId);
	if (params.staffCategory) query.set("staffCategory", params.staffCategory);
	if (params.employmentStatus) query.set("employmentStatus", params.employmentStatus);
	return apiFetch<Page<Employee>>(`/employees?${query.toString()}`);
}

export function getEmployee(id: number): Promise<Employee> {
	return apiFetch<Employee>(`/employees/${id}`);
}
