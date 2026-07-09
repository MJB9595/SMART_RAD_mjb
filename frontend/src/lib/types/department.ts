export interface Department {
	id: number;
	name: string;
	parentDepartmentId: number | null;
	parentDepartmentName: string | null;
	active: boolean;
}
