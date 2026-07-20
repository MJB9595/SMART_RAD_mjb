import { apiFetch } from "@/lib/api/client";
import type {
	Career,
	Certification,
	Education,
	EmployeeRecordSummary,
	Family,
	Language,
	Military,
} from "@/lib/types/employee";

/** 인사기록 등록/수정 요청 바디 (모달 폼이 넘기는 정규화된 값). */
export type RecordBody = Record<string, unknown>;

// ===== 학력 =====
export function getEducations(employeeId: number): Promise<Education[]> {
	return apiFetch<Education[]>(`/employees/${employeeId}/educations`);
}
export function createEducation(employeeId: number, body: RecordBody): Promise<Education> {
	return apiFetch<Education>(`/employees/${employeeId}/educations`, { method: "POST", body });
}
export function updateEducation(id: number, body: RecordBody): Promise<Education> {
	return apiFetch<Education>(`/educations/${id}`, { method: "PUT", body });
}
export function deleteEducation(id: number): Promise<void> {
	return apiFetch<void>(`/educations/${id}`, { method: "DELETE" });
}

// ===== 경력 =====
export function getCareers(employeeId: number): Promise<Career[]> {
	return apiFetch<Career[]>(`/employees/${employeeId}/careers`);
}
export function createCareer(employeeId: number, body: RecordBody): Promise<Career> {
	return apiFetch<Career>(`/employees/${employeeId}/careers`, { method: "POST", body });
}
export function updateCareer(id: number, body: RecordBody): Promise<Career> {
	return apiFetch<Career>(`/careers/${id}`, { method: "PUT", body });
}
export function deleteCareer(id: number): Promise<void> {
	return apiFetch<void>(`/careers/${id}`, { method: "DELETE" });
}

// ===== 자격증 =====
export function getCertifications(employeeId: number): Promise<Certification[]> {
	return apiFetch<Certification[]>(`/employees/${employeeId}/certifications`);
}
export function createCertification(employeeId: number, body: RecordBody): Promise<Certification> {
	return apiFetch<Certification>(`/employees/${employeeId}/certifications`, { method: "POST", body });
}
export function updateCertification(id: number, body: RecordBody): Promise<Certification> {
	return apiFetch<Certification>(`/certifications/${id}`, { method: "PUT", body });
}
export function deleteCertification(id: number): Promise<void> {
	return apiFetch<void>(`/certifications/${id}`, { method: "DELETE" });
}

// ===== 가족 =====
export function getFamilies(employeeId: number): Promise<Family[]> {
	return apiFetch<Family[]>(`/employees/${employeeId}/families`);
}
export function createFamily(employeeId: number, body: RecordBody): Promise<Family> {
	return apiFetch<Family>(`/employees/${employeeId}/families`, { method: "POST", body });
}
export function updateFamily(id: number, body: RecordBody): Promise<Family> {
	return apiFetch<Family>(`/families/${id}`, { method: "PUT", body });
}
export function deleteFamily(id: number): Promise<void> {
	return apiFetch<void>(`/families/${id}`, { method: "DELETE" });
}

// ===== 병역 =====
export function getMilitaries(employeeId: number): Promise<Military[]> {
	return apiFetch<Military[]>(`/employees/${employeeId}/militaries`);
}
export function createMilitary(employeeId: number, body: RecordBody): Promise<Military> {
	return apiFetch<Military>(`/employees/${employeeId}/militaries`, { method: "POST", body });
}
export function updateMilitary(id: number, body: RecordBody): Promise<Military> {
	return apiFetch<Military>(`/militaries/${id}`, { method: "PUT", body });
}
export function deleteMilitary(id: number): Promise<void> {
	return apiFetch<void>(`/militaries/${id}`, { method: "DELETE" });
}

// ===== 어학 =====
export function getLanguages(employeeId: number): Promise<Language[]> {
	return apiFetch<Language[]>(`/employees/${employeeId}/languages`);
}
export function createLanguage(employeeId: number, body: RecordBody): Promise<Language> {
	return apiFetch<Language>(`/employees/${employeeId}/languages`, { method: "POST", body });
}
export function updateLanguage(id: number, body: RecordBody): Promise<Language> {
	return apiFetch<Language>(`/languages/${id}`, { method: "PUT", body });
}
export function deleteLanguage(id: number): Promise<void> {
	return apiFetch<void>(`/languages/${id}`, { method: "DELETE" });
}

// ===== 요약 / 통계 =====
export function getRecordSummary(employeeId: number): Promise<EmployeeRecordSummary> {
	return apiFetch<EmployeeRecordSummary>(`/employees/${employeeId}/record-summary`);
}
export function countExpiringCertifications(days = 90): Promise<{ count: number }> {
	return apiFetch<{ count: number }>(`/records/stats/expiring-certifications?days=${days}`);
}
