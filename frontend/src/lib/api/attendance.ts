import { apiFetch } from "@/lib/api/client";
import type { Attendance, AttendanceSummary } from "@/lib/types/attendance";

export function listAttendances(workDate: string): Promise<Attendance[]> {
	return apiFetch<Attendance[]>(`/attendances?workDate=${workDate}`);
}

export function getAttendanceSummary(workDate: string): Promise<AttendanceSummary> {
	return apiFetch<AttendanceSummary>(`/attendances/summary?workDate=${workDate}`);
}
