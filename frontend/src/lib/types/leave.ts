export type LeaveType = "ANNUAL" | "SICK" | "OFFICIAL" | "SPECIAL" | "PARENTAL";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveRequest {
	id: number;
	documentNumber: string;
	employeeId: number;
	employeeName: string;
	leaveType: LeaveType;
	startDate: string;
	endDate: string;
	days: number;
	reason: string | null;
	approvalStatus: ApprovalStatus;
	approverName: string | null;
	approvedAt: string | null;
}

export interface LeaveBalance {
	id: number;
	employeeId: number;
	employeeNumber: string;
	employeeName: string;
	departmentName: string;
	year: number;
	totalGranted: number;
	usedDays: number;
	remaining: number;
}
