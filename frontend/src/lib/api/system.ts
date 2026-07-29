import { apiFetch } from "@/lib/api/client";
import type { AuditLog, CommonCode, CommonCodeUpsertBody, PermissionInfo, RoleInfo, RoleUpsertBody } from "@/lib/types/system";
import type { Page } from "@/lib/types/employee";

export function listCommonCodes(): Promise<CommonCode[]> {
	return apiFetch<CommonCode[]>("/system/common-codes");
}

/** 공통코드 등록 (ADMIN). */
export function createCommonCode(body: CommonCodeUpsertBody): Promise<CommonCode> {
	return apiFetch<CommonCode>("/system/common-codes", { method: "POST", body });
}

/** 공통코드 수정 — 코드명·정렬순서·상위코드 (그룹/코드는 변경 불가). */
export function updateCommonCode(id: number, body: CommonCodeUpsertBody): Promise<CommonCode> {
	return apiFetch<CommonCode>(`/system/common-codes/${id}`, { method: "PUT", body });
}

/** 공통코드 삭제 (ADMIN). */
export function deleteCommonCode(id: number): Promise<void> {
	return apiFetch<void>(`/system/common-codes/${id}`, { method: "DELETE" });
}

export function listRoles(): Promise<RoleInfo[]> {
	return apiFetch<RoleInfo[]>("/system/roles");
}

export function listAuditLogs(size = 30): Promise<Page<AuditLog>> {
	return apiFetch<Page<AuditLog>>(`/system/audit-logs?size=${size}`);
}

/** 역할에 부여할 수 있는 전체 권한 목록 (ADMIN). */
export function listPermissions(): Promise<PermissionInfo[]> {
	return apiFetch<PermissionInfo[]>("/system/permissions");
}

/** 역할 생성 (ADMIN). */
export function createRole(body: RoleUpsertBody): Promise<RoleInfo> {
	return apiFetch<RoleInfo>("/system/roles", { method: "POST", body });
}

/** 역할 수정 — 이름·설명·권한 (코드는 변경 불가). */
export function updateRole(id: number, body: RoleUpsertBody): Promise<RoleInfo> {
	return apiFetch<RoleInfo>(`/system/roles/${id}`, { method: "PUT", body });
}

/** 역할 활성/비활성 전환. */
export function setRoleActive(id: number, active: boolean): Promise<RoleInfo> {
	return apiFetch<RoleInfo>(`/system/roles/${id}/active?active=${active}`, { method: "PATCH" });
}

/** 역할 삭제 (사용 중이면 409). */
export function deleteRole(id: number): Promise<void> {
	return apiFetch<void>(`/system/roles/${id}`, { method: "DELETE" });
}
