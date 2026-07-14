import { apiFetch } from "@/lib/api/client";
import type { SalaryBasic } from "@/lib/types/salary";

export function listSalaries(): Promise<SalaryBasic[]> {
	return apiFetch<SalaryBasic[]>("/salaries");
}
