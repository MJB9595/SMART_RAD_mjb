import { apiFetch } from "@/lib/api/client";

export interface Allowance {
	id: number;
	name: string;
	taxable: boolean;
	fixed: boolean;
	active: boolean;
}

/** 수당 마스터 목록 (ADMIN). */
export function listAllowances(): Promise<Allowance[]> {
	return apiFetch<Allowance[]>("/allowances");
}

export interface AllowanceCreateBody {
	name: string;
	taxable: boolean;
	fixed: boolean;
}

/** 수당 마스터 등록 (ADMIN). */
export function createAllowance(body: AllowanceCreateBody): Promise<Allowance> {
	return apiFetch<Allowance>("/allowances", { method: "POST", body });
}

/** 수당 마스터 수정. */
export function updateAllowance(id: number, body: AllowanceCreateBody): Promise<Allowance> {
	return apiFetch<Allowance>(`/allowances/${id}`, { method: "PUT", body });
}

/** 활성/비활성 전환 — 비활성 수당은 신규 지급 설정에서 제외된다. */
export function setAllowanceActive(id: number, active: boolean): Promise<Allowance> {
	return apiFetch<Allowance>(`/allowances/${id}/active?active=${active}`, { method: "PATCH" });
}

/** 수당 마스터 삭제 (지급 중인 교직원이 있으면 409). */
export function deleteAllowance(id: number): Promise<void> {
	return apiFetch<void>(`/allowances/${id}`, { method: "DELETE" });
}
