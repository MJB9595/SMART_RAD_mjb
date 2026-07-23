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
