import { apiFetch } from "@/lib/api/client";
import type { ApprovalSlot } from "@/lib/types/signup";

export interface SlotCreateBody {
	staffCategory: string;
	departmentId: number;
	positionId: number;
	employmentTypeId: number;
	role: string;
	hireDate?: string | null;
	label?: string | null;
}

/** 승인 자리 생성 (교직원 등록 폼 → 직위·권한만). */
export function createSlot(body: SlotCreateBody): Promise<ApprovalSlot> {
	return apiFetch<ApprovalSlot>("/approval-slots", { method: "POST", body });
}

/** 채울 수 있는(OPEN) 자리 목록 — 승인 매칭용. */
export function listOpenSlots(): Promise<ApprovalSlot[]> {
	return apiFetch<ApprovalSlot[]>("/approval-slots/open");
}

export function deleteSlot(id: number): Promise<void> {
	return apiFetch<void>(`/approval-slots/${id}`, { method: "DELETE" });
}
