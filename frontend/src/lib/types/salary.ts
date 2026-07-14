export interface SalaryBasic {
	id: number;
	employeeId: number;
	employeeNumber: string;
	employeeName: string;
	departmentName: string;
	positionName: string;
	basePay: number;
	mealAllowance: number;
	transportAllowance: number;
	positionAllowance: number;
	totalAllowance: number;
	totalPay: number;
	bankName: string | null;
	accountNumber: string | null;
	accountHolder: string | null;
	effectiveDate: string;
}
