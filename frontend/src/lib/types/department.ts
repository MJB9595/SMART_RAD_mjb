export type OrgType = "ACADEMIC" | "ADMINISTRATIVE";

export interface Department {
	id: number;
	name: string;
	orgType: OrgType;
	parentDepartmentId: number | null;
	parentDepartmentName: string | null;
	headcount: number;
	active: boolean;
}

export interface DepartmentTree {
	id: number;
	name: string;
	children: DepartmentTree[];
}
