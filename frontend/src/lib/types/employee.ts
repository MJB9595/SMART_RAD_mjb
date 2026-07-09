export type EmployeeRole = "ADMIN" | "EMPLOYEE";
export type EmploymentStatus = "EMPLOYED" | "ON_LEAVE" | "RESIGNED";

export interface Employee {
	id: number;
	employeeNumber: string;
	name: string;
	email: string;
	phone: string | null;
	departmentId: number;
	departmentName: string;
	positionId: number;
	positionName: string;
	employmentTypeId: number;
	employmentTypeName: string;
	role: EmployeeRole;
	employmentStatus: EmploymentStatus;
	hireDate: string;
	resignDate: string | null;
}

export interface Page<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}
