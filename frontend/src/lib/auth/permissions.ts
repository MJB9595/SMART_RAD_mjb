import { AuthUser } from "@/lib/types/auth";

/** 권한 코드 상수 — 오타로 조용히 false 가 되는 걸 막는다. */
export const PERM = {
	EMPLOYEE_READ: "EMPLOYEE_READ",
	EMPLOYEE_WRITE: "EMPLOYEE_WRITE",
	APPOINTMENT_APPROVE: "APPOINTMENT_APPROVE",
	LEAVE_APPROVE: "LEAVE_APPROVE",
	PAYROLL_READ: "PAYROLL_READ",
	SYSTEM_MANAGE: "SYSTEM_MANAGE",
} as const;

/**
 * 권한 관리(RBAC)에서 부여한 권한을 갖고 있는지.
 *
 * <p>역할 열거값(ADMIN/HR/EMPLOYEE)이 아니라 실제 부여된 권한을 본다. 그래서 권한 관리 화면에서
 * 일반직원 역할에 EMPLOYEE_WRITE 를 추가하면, 그 사용자에게 등록·수정 버튼이 곧바로 나타난다.
 */
export function hasPermission(user: AuthUser | null, permission: string): boolean {
	if (!user) return false;
	return (user.permissions ?? []).includes(permission);
}

export function hasAnyPermission(user: AuthUser | null, permissions: string[]): boolean {
	return permissions.some((p) => hasPermission(user, p));
}

export function isAdminOrHr(user: AuthUser | null): boolean {
	if (!user) return false;
	return user.role === "ADMIN" || user.role === "HR";
}

export function canApproveTarget(
	currentUser: AuthUser | null,
	targetUserId: number,
	targetDepartmentId?: number | null,
	targetPositionLevel?: number | null
): boolean {
	if (!currentUser) return false;
	
	// 관리자 또는 인사팀은 무조건 승인 가능
	if (isAdminOrHr(currentUser)) return true;

	// 본인건 승인 불가
	if (currentUser.employeeId === targetUserId) return false;

	// 부서 및 직급 정보가 없으면 비교 불가
	if (
		currentUser.departmentId == null ||
		currentUser.positionLevel == null ||
		targetDepartmentId == null ||
		targetPositionLevel == null
	) {
		return false;
	}

	// 다른 부서면 승인 불가
	if (currentUser.departmentId !== targetDepartmentId) return false;

	// 내 직급 숫자가 더 작아야(높은 직급) 승인 가능
	return currentUser.positionLevel < targetPositionLevel;
}
