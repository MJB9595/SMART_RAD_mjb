import { AuthUser } from "@/lib/types/auth";

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
