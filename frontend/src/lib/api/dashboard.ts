import { apiFetch } from "./client";

export interface HeadcountDto {
	departmentName: string;
	headcount: number;
}

export interface AttendanceSummaryDto {
	status: string;
	count: number;
}

export function getDashboardHeadcount() {
	return apiFetch<HeadcountDto[]>("/dashboard/headcount");
}

export function getDashboardTodayAttendance() {
	return apiFetch<AttendanceSummaryDto[]>("/dashboard/attendance/today");
}
