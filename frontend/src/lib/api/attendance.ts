import { apiFetch } from "@/lib/api/client";
import type { Attendance, AttendanceSummary } from "@/lib/types/attendance";

export function listAttendances(workDate: string): Promise<Attendance[]> {
	return apiFetch<Attendance[]>(`/attendances?workDate=${workDate}`);
}

export function getAttendanceSummary(workDate: string): Promise<AttendanceSummary> {
	return apiFetch<AttendanceSummary>(`/attendances/summary?workDate=${workDate}`);
}

export interface MonthlyAttendance {
	employeeId: number;
	employeeNumber: string;
	employeeName: string;
	departmentName: string;
	present: number;
	late: number;
	absent: number;
	leave: number;
	total: number;
}

/** 월 근태 현황 — 직원별 월간 집계 (ADMIN). */
export function listMonthlyAttendance(year: number, month: number): Promise<MonthlyAttendance[]> {
	return apiFetch<MonthlyAttendance[]>(`/attendances/monthly?year=${year}&month=${month}`);
}
