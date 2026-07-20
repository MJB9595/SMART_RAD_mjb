import { apiFetch } from "@/lib/api/client";
import type { Employee, Page } from "@/lib/types/employee";

export interface EmployeeSearchParams {
	keyword?: string;
	departmentId?: string;
	positionId?: string;
	staffCategory?: string;
	employmentStatus?: string;
	page?: number;
	size?: number;
}

export function searchEmployees(params: EmployeeSearchParams = {}): Promise<Page<Employee>> {
	const query = new URLSearchParams({
		page: String(params.page ?? 0),
		size: String(params.size ?? 10),
	});
	if (params.keyword) query.set("keyword", params.keyword);
	if (params.departmentId) query.set("departmentId", params.departmentId);
	if (params.positionId) query.set("positionId", params.positionId);
	if (params.staffCategory) query.set("staffCategory", params.staffCategory);
	if (params.employmentStatus) query.set("employmentStatus", params.employmentStatus);
	return apiFetch<Page<Employee>>(`/employees?${query.toString()}`);
}

export function getEmployee(id: number): Promise<Employee> {
	return apiFetch<Employee>(`/employees/${id}`);
}

export interface EmployeeCreateBody {
	employeeNumber: string;
	name: string;
	email: string;
	password: string;
	phone?: string | null;
	staffCategory: string;
	departmentId: number;
	positionId: number;
	employmentTypeId: number;
	role: string;
	hireDate: string;
	birthDate?: string | null;
	gender?: string | null;
	address?: string | null;
	emergencyContact?: string | null;
}

export function createEmployee(body: EmployeeCreateBody): Promise<Employee> {
	return apiFetch<Employee>("/employees", { method: "POST", body });
}

export interface EmployeeUpdateBody {
	name: string;
	phone?: string | null;
	departmentId: number;
	positionId: number;
	employmentTypeId: number;
	address?: string | null;
	emergencyContact?: string | null;
}

export function updateEmployee(id: number, body: EmployeeUpdateBody): Promise<Employee> {
	return apiFetch<Employee>(`/employees/${id}`, { method: "PUT", body });
}

export function changeEmploymentStatus(
	id: number,
	body: { employmentStatus: string; resignDate?: string | null },
): Promise<Employee> {
	return apiFetch<Employee>(`/employees/${id}/status`, { method: "PATCH", body });
}

export function deleteEmployee(id: number): Promise<void> {
	return apiFetch<void>(`/employees/${id}`, { method: "DELETE" });
}
