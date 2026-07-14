package com.tphr.hr.payroll.dto;

import com.tphr.hr.payroll.Payroll;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PayrollResponse(
		Long id,
		Long employeeId,
		String employeeNumber,
		String employeeName,
		String departmentName,
		String positionName,
		String payrollYearMonth,
		LocalDate paymentDate,
		BigDecimal totalPayAmount,
		BigDecimal totalDeductionAmount,
		BigDecimal realPayAmount,
		String payrollStatusCode
) {

	public static PayrollResponse from(Payroll p) {
		return new PayrollResponse(
				p.getId(), p.getEmployee().getId(), p.getEmployee().getEmployeeNumber(), p.getEmployee().getName(),
				p.getDepartmentNameSnapshot(), p.getPositionNameSnapshot(),
				p.getPayrollYearMonth(), p.getPaymentDate(), p.getTotalPayAmount(), p.getTotalDeductionAmount(),
				p.getRealPayAmount(), p.getPayrollStatusCode());
	}
}
