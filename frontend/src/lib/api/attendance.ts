import { apiDownload, apiFetch } from "@/lib/api/client";
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

/** 월 근태 현황 엑셀 다운로드 (ADMIN). */
export function exportMonthlyAttendance(year: number, month: number): Promise<void> {
	return apiDownload(
		`/attendances/monthly/export?year=${year}&month=${month}`,
		`${year}년_${String(month).padStart(2, "0")}월_근태현황.xlsx`,
	);
}

export interface AttendanceCreateBody {
	employeeId: number;
	workDate: string;
	checkInTime?: string | null;
	checkOutTime?: string | null;
	status: string;
}

/** 근태 등록/수정 (같은 직원·날짜면 갱신). ADMIN. */
export function createAttendance(body: AttendanceCreateBody): Promise<Attendance> {
	return apiFetch<Attendance>("/attendances", { method: "POST", body });
}
