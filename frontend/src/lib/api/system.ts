import { apiFetch } from "@/lib/api/client";
import type { AuditLog, CommonCode, RoleInfo } from "@/lib/types/system";
import type { Page } from "@/lib/types/employee";

export function listCommonCodes(): Promise<CommonCode[]> {
	return apiFetch<CommonCode[]>("/system/common-codes");
}

export function listRoles(): Promise<RoleInfo[]> {
	return apiFetch<RoleInfo[]>("/system/roles");
}

export function listAuditLogs(size = 30): Promise<Page<AuditLog>> {
	return apiFetch<Page<AuditLog>>(`/system/audit-logs?size=${size}`);
}
