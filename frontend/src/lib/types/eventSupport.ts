export type EventType = "MARRIAGE" | "CHILDBIRTH" | "BEREAVEMENT" | "OTHER";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EventSupport {
	id: number;
	documentNumber: string;
	employeeId: number;
	employeeName: string;
	eventType: EventType;
	amount: number;
	eventDate: string;
	description: string | null;
	approvalStatus: ApprovalStatus;
	approverName: string | null;
	approvedAt: string | null;
}
