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

export interface LeavePolicy {
	id: number;
	positionId: number;
	annualLeaveDays: number;
	maxCarryOverDays: number;
	halfDayAllowed: boolean;
	note: string | null;
}

/** 직급별 휴가 정책 목록 (ADMIN). */
export function listLeavePolicies(): Promise<LeavePolicy[]> {
	return apiFetch<LeavePolicy[]>("/leave-policies");
}
