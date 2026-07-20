export type PositionCategory = "FACULTY" | "STAFF" | "COMMON";

export interface Position {
	id: number;
	name: string;
	category: PositionCategory;
	sortOrder: number;
	active: boolean;
}

export interface EmploymentType {
	id: number;
	name: string;
	active: boolean;
}
