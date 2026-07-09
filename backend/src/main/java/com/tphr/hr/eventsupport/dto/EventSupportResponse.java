package com.tphr.hr.eventsupport.dto;

import com.tphr.hr.common.ApprovalStatus;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.eventsupport.EmployeeEventSupport;
import com.tphr.hr.eventsupport.EventType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EventSupportResponse(
		Long id,
		String documentNumber,
		Long employeeId,
		String employeeName,
		EventType eventType,
		BigDecimal amount,
		LocalDate eventDate,
		String description,
		ApprovalStatus approvalStatus,
		String approverName,
		LocalDateTime approvedAt
) {

	public static EventSupportResponse from(EmployeeEventSupport eventSupport) {
		Employee approver = eventSupport.getApprover();
		return new EventSupportResponse(
				eventSupport.getId(),
				eventSupport.getDocumentNumber(),
				eventSupport.getEmployee().getId(),
				eventSupport.getEmployee().getName(),
				eventSupport.getEventType(),
				eventSupport.getAmount(),
				eventSupport.getEventDate(),
				eventSupport.getDescription(),
				eventSupport.getApprovalStatus(),
				approver != null ? approver.getName() : null,
				eventSupport.getApprovedAt()
		);
	}
}
