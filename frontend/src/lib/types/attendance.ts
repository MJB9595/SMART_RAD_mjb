export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "ANNUAL_LEAVE";

export interface Attendance {
	id: number;
	employeeId: number;
	employeeNumber: string;
	employeeName: string;
	workDate: string;
	checkInTime: string | null;
	checkOutTime: string | null;
	status: AttendanceStatus;
}

export interface AttendanceSummary {
	workDate: string;
	present: number;
	late: number;
	absent: number;
	annualLeave: number;
}
