package com.tphr.hr.leave.dto;

import com.tphr.hr.leave.LeaveType;
import java.math.BigDecimal;

public record LeaveTypeResponse(
		Long id,
		String name,
		boolean paid,
		BigDecimal defaultDays
) {

	public static LeaveTypeResponse from(LeaveType t) {
		return new LeaveTypeResponse(t.getId(), t.getName(), t.isPaid(), t.getDefaultDays());
	}
}
