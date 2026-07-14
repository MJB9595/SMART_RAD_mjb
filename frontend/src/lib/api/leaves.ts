import { apiFetch } from "@/lib/api/client";
import type { LeaveBalance, LeaveRequest } from "@/lib/types/leave";
import type { Page } from "@/lib/types/employee";

export function listLeaveRequests(size = 50): Promise<Page<LeaveRequest>> {
	return apiFetch<Page<LeaveRequest>>(`/leaves?size=${size}`);
}

export function approveLeave(id: number): Promise<LeaveRequest> {
	return apiFetch<LeaveRequest>(`/leaves/${id}/approve`, { method: "PATCH" });
}

export function rejectLeave(id: number): Promise<LeaveRequest> {
	return apiFetch<LeaveRequest>(`/leaves/${id}/reject`, { method: "PATCH" });
}

export function listLeaveBalances(year: number): Promise<LeaveBalance[]> {
	return apiFetch<LeaveBalance[]>(`/leaves/balances?year=${year}`);
}
