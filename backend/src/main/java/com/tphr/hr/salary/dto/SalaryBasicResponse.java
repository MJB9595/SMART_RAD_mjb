package com.tphr.hr.salary.dto;

import com.tphr.hr.salary.SalaryBasic;
import java.math.BigDecimal;
import java.time.LocalDate;

public record SalaryBasicResponse(
		Long id,
		Long employeeId,
		String employeeNumber,
		String employeeName,
		String departmentName,
		String positionName,
		BigDecimal basePay,
		BigDecimal mealAllowance,
		BigDecimal transportAllowance,
		BigDecimal positionAllowance,
		BigDecimal totalAllowance,
		BigDecimal totalPay,
		String bankName,
		String accountNumber,
		String accountHolder,
		LocalDate effectiveDate
) {

	public static SalaryBasicResponse from(SalaryBasic s) {
		return new SalaryBasicResponse(
				s.getId(), s.getEmployee().getId(), s.getEmployee().getEmployeeNumber(), s.getEmployee().getName(),
				s.getEmployee().getDepartment().getName(), s.getEmployee().getPosition().getName(),
				s.getBasePay(), s.getMealAllowance(), s.getTransportAllowance(), s.getPositionAllowance(),
				s.totalAllowance(), s.totalPay(), s.getBankName(), s.getAccountNumber(), s.getAccountHolder(),
				s.getEffectiveDate());
	}
}
