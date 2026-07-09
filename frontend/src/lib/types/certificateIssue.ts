export type CertificateType = "EMPLOYMENT" | "CAREER";
export type IssueStatus = "PENDING" | "ISSUED";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CertificateIssue {
	id: number;
	documentNumber: string;
	employeeId: number;
	employeeName: string;
	certificateType: CertificateType;
	purpose: string | null;
	issueStatus: IssueStatus;
	approvalStatus: ApprovalStatus;
	approverName: string | null;
	approvedAt: string | null;
	issuedAt: string | null;
}
