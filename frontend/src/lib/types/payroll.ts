export type PayrollStatus = "COMPLETED" | "PENDING" | "ERROR";

export interface Payroll {
	id: number;
	employeeId: number;
	employeeNumber: string;
	employeeName: string;
	departmentName: string;
	positionName: string;
	payrollYearMonth: string;
	paymentDate?: string;
	totalPayAmount?: number;
	totalDeductionAmount?: number;
	realPayAmount?: number;
	payrollStatusCode?: string;
}

export interface Page<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}
