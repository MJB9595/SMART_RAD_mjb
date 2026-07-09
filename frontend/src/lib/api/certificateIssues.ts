import { apiFetch } from "@/lib/api/client";
import type { CertificateIssue } from "@/lib/types/certificateIssue";

export function listCertificateIssues(): Promise<CertificateIssue[]> {
	return apiFetch<CertificateIssue[]>("/certificate-issues");
}
