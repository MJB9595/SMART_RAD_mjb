import { apiFetch } from "@/lib/api/client";
import type { Employee, Page } from "@/lib/types/employee";

export interface EmployeeSearchParams {
	keyword?: string;
	departmentId?: string;
	employmentStatus?: string;
}

export function searchEmployees(params: EmployeeSearchParams = {}): Promise<Page<Employee>> {
	const query = new URLSearchParams({ size: "50" });
	if (params.keyword) query.set("keyword", params.keyword);
	if (params.departmentId) query.set("departmentId", params.departmentId);
	if (params.employmentStatus) query.set("employmentStatus", params.employmentStatus);

	return apiFetch<Page<Employee>>(`/employees?${query.toString()}`);
}
