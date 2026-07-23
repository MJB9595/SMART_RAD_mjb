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
