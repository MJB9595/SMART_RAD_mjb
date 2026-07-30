import { apiDownload, apiFetch } from "@/lib/api/client";
import type { Attendance, AttendanceSummary } from "@/lib/types/attendance";

export function listAttendances(workDate: string): Promise<Attendance[]> {
	return apiFetch<Attendance[]>(`/attendances?workDate=${workDate}`);
}

export function getAttendanceSummary(workDate: string): Promise<AttendanceSummary> {
	return apiFetch<AttendanceSummary>(`/attendances/summary?workDate=${workDate}`);
}

/** 격자 한 칸 — 서버가 내려주는 실제 근태 기록. */
export interface DailyAttendance {
	status: string;
	checkInTime: string | null;
	checkOutTime: string | null;
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
	/** 일(1~31) → 그 날의 근태. 기록이 없는 날은 키가 없다. */
	daily: Record<number, DailyAttendance>;
}

/** 월 근태 현황 — 승인 권한이 없으면 서버가 본인 것만 내려준다. */
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
