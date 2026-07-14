package com.tphr.hr.leave.dto;

import com.tphr.hr.common.ApprovalStatus;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.leave.LeaveRequest;
import com.tphr.hr.leave.LeaveType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record LeaveRequestResponse(
		Long id,
		String documentNumber,
		Long employeeId,
		String employeeName,
		LeaveType leaveType,
		LocalDate startDate,
		LocalDate endDate,
		BigDecimal days,
		String reason,
		ApprovalStatus approvalStatus,
		String approverName,
		LocalDateTime approvedAt
) {

	public static LeaveRequestResponse from(LeaveRequest r) {
		Employee approver = r.getApprover();
		return new LeaveRequestResponse(
				r.getId(), r.getDocumentNumber(), r.getEmployee().getId(), r.getEmployee().getName(),
				r.getLeaveType(), r.getStartDate(), r.getEndDate(), r.getDays(), r.getReason(),
				r.getApprovalStatus(), approver != null ? approver.getName() : null, r.getApprovedAt());
	}
}
