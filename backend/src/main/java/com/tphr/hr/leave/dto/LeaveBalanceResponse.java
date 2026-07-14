package com.tphr.hr.leave.dto;

import com.tphr.hr.leave.LeaveBalance;
import java.math.BigDecimal;

public record LeaveBalanceResponse(
		Long id,
		Long employeeId,
		String employeeNumber,
		String employeeName,
		String departmentName,
		int year,
		BigDecimal totalGranted,
		BigDecimal usedDays,
		BigDecimal remaining
) {

	public static LeaveBalanceResponse from(LeaveBalance b) {
		return new LeaveBalanceResponse(
				b.getId(), b.getEmployee().getId(), b.getEmployee().getEmployeeNumber(), b.getEmployee().getName(),
				b.getEmployee().getDepartment().getName(), b.getYear(), b.getTotalGranted(), b.getUsedDays(),
				b.getRemaining());
	}
}
