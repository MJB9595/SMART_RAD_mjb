import { apiFetch } from "@/lib/api/client";
import type { Payroll, Page } from "@/lib/types/payroll";

export function listPayrolls(params?: Record<string, string>): Promise<Page<Payroll>> {
	const qs = params ? new URLSearchParams(params).toString() : "";
	return apiFetch<Payroll[]>(`/payrolls${qs ? "?" + qs : ""}`).then((list) => ({
		content: list,
		totalElements: list.length,
		totalPages: 1,
		number: 0,
		size: list.length,
	}));
}
