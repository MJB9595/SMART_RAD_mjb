export type AppointmentType = "HIRE" | "PROMOTION" | "TRANSFER" | "CONCURRENT";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Appointment {
	id: number;
	documentNumber: string;
	employeeId: number;
	employeeNumber: string;
	employeeName: string;
	appointmentType: AppointmentType;
	fromDepartmentId: number | null;
	fromDepartmentName: string | null;
	toDepartmentId: number | null;
	toDepartmentName: string | null;
	fromPositionId: number | null;
	fromPositionName: string | null;
	toPositionId: number | null;
	toPositionName: string | null;
	appointmentDate: string;
	reason: string | null;
	approvalStatus: ApprovalStatus;
	approverName: string | null;
	approvedAt: string | null;
	registeredByName: string;
}
