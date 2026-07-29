import { apiFetch } from "@/lib/api/client";

export interface EventSupport {
	id: number;
	employeeId: number;
	documentNumber: string;
	eventType: string;
	targetName: string;
	applicationDate: string;
	eventDate: string;
	requestedAmount: number;
	approvalStatus: string;
	employeeName: string;
	employeeNumber: string;
	departmentId: number | null;
	departmentName: string | null;
	positionLevel: number | null;
	positionName: string | null;
}

export interface Certificate {
	id: number;
	employeeId: number;
	documentNumber: string;
	certificateType: string;
	applicationDate: string;
	purpose: string | null;
	issueStatus: string;
	approvalStatus: string;
	// 증명서 서식 출력용 대상자 정보
	employeeName: string;
	employeeNumber: string;
	departmentId: number | null;
	departmentName: string | null;
	positionLevel: number | null;
	positionName: string | null;
	hireDate: string | null;
	issuedAt: string | null;
}

/** 경조비 신청 내역 (ADMIN). */
export function listEventSupports(): Promise<EventSupport[]> {
	return apiFetch<EventSupport[]>("/welfare/event-support");
}

/** 증명서 발급 신청 내역 (ADMIN). */
export function listCertificates(): Promise<Certificate[]> {
	return apiFetch<Certificate[]>("/welfare/certificate");
}

export interface EventSupportCreateBody {
	employeeId: number;
	eventType: string;
	familyRelation?: string | null;
	targetName: string;
	applicationDate: string;
	eventDate: string;
	requestedAmount: number;
	eventLocation?: string | null;
}

/** 경조비 신청 (문서번호는 서버에서 자동 채번). ADMIN. */
export function createEventSupport(body: EventSupportCreateBody): Promise<EventSupport> {
	return apiFetch<EventSupport>("/welfare/event-support", { method: "POST", body });
}

/** 경조비 신청 승인 */
export function approveEventSupport(id: number): Promise<void> {
	return apiFetch<void>(`/welfare/event-support/${id}/approve`, { method: "POST" });
}

/** 경조비 신청 반려 */
export function rejectEventSupport(id: number): Promise<void> {
	return apiFetch<void>(`/welfare/event-support/${id}/reject`, { method: "POST" });
}

export interface CertificateCreateBody {
	employeeId: number;
	certificateType: string;
	applicationDate: string;
	purpose?: string | null;
}

/** 증명서 발급 신청 (문서번호는 서버에서 자동 채번). ADMIN. */
export function createCertificate(body: CertificateCreateBody): Promise<Certificate> {
	return apiFetch<Certificate>("/welfare/certificate", { method: "POST", body });
}

/** 증명서 발급 처리 — 승인 시 발급완료(ISSUED)로 전환된다. ADMIN. */
export function approveCertificate(id: number): Promise<void> {
	return apiFetch<void>(`/welfare/certificate/${id}/approve`, { method: "POST" });
}

/** 증명서 발급 반려. ADMIN. */
export function rejectCertificate(id: number, memo?: string): Promise<void> {
	const qs = memo ? `?memo=${encodeURIComponent(memo)}` : "";
	return apiFetch<void>(`/welfare/certificate/${id}/reject${qs}`, { method: "POST" });
}
