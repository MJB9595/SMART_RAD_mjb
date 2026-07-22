import type { PositionCategory } from "@/lib/types/meta";

export type SlotStatus = "OPEN" | "FILLED";
export type StaffCategory = "FACULTY" | "STAFF";
export type Role = "ADMIN" | "EMPLOYEE";

export interface ApprovalSlot {
	id: number;
	staffCategory: StaffCategory;
	departmentId: number;
	departmentName: string;
	positionId: number;
	positionName: string;
	employmentTypeId: number;
	employmentTypeName: string;
	role: Role;
	hireDate: string | null;
	label: string | null;
	status: SlotStatus;
}

// meta에서 재사용
export type { PositionCategory };
