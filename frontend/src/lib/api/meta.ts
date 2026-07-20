import { apiFetch } from "@/lib/api/client";
import type { EmploymentType, Position } from "@/lib/types/meta";

export function listPositions(): Promise<Position[]> {
	return apiFetch<Position[]>("/positions");
}

export function listEmploymentTypes(): Promise<EmploymentType[]> {
	return apiFetch<EmploymentType[]>("/employment-types");
}
