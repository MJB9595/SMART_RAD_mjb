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
