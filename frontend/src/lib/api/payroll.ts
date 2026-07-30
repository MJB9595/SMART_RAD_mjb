import { apiDownload, apiFetch } from "@/lib/api/client";
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

export interface PayrollFilterOptions {
	yearMonths: string[];
	statuses: string[];
}

/** 필터 선택지 — 실제 데이터에서 뽑은 급여월·상태 목록. */
export function getPayrollFilterOptions(): Promise<PayrollFilterOptions> {
	return apiFetch<PayrollFilterOptions>("/payrolls/filter-options");
}

/** 전체 급여대장 엑셀 다운로드 (ADMIN). */
export function exportPayrolls(): Promise<void> {
	return apiDownload("/payrolls/export", "급여대장.xlsx");
}

/** 개인 급여 명세서 엑셀 다운로드 (ADMIN). */
export function exportPayroll(id: number): Promise<void> {
	return apiDownload(`/payrolls/${id}/export`, `급여명세서_${id}.xlsx`);
}

export type SettlementFormType = "bank" | "acc" | "full";

/**
 * 정산용 급여 엑셀 다운로드 (ADMIN).
 * yearMonth는 백엔드 검증 규격에 맞춰 `YYYYMM` 형식으로 전달한다.
 */
export function exportSettlement(yearMonth: string, formType: SettlementFormType): Promise<void> {
	const params = new URLSearchParams({ yearMonth, formType });
	return apiDownload(
		`/payrolls/settlement/export?${params.toString()}`,
		`급여정산_${yearMonth}_${formType}.xlsx`,
	);
}
