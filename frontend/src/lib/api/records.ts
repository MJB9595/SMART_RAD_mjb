import { apiFetch } from "@/lib/api/client";
import type { Career, Certification, Education } from "@/lib/types/employee";

export function getEducations(employeeId: number): Promise<Education[]> {
	return apiFetch<Education[]>(`/employees/${employeeId}/educations`);
}

export function getCareers(employeeId: number): Promise<Career[]> {
	return apiFetch<Career[]>(`/employees/${employeeId}/careers`);
}

export function getCertifications(employeeId: number): Promise<Certification[]> {
	return apiFetch<Certification[]>(`/employees/${employeeId}/certifications`);
}
