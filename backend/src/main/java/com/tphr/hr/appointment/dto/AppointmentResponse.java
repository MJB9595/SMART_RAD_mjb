package com.tphr.hr.appointment.dto;

import com.tphr.hr.appointment.AppointmentType;
import com.tphr.hr.appointment.EmployeeAppointment;
import com.tphr.hr.common.ApprovalStatus;
import com.tphr.hr.department.Department;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.position.Position;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record AppointmentResponse(
		Long id,
		String documentNumber,
		Long employeeId,
		String employeeNumber,
		String employeeName,
		AppointmentType appointmentType,
		Long fromDepartmentId,
		String fromDepartmentName,
		Long toDepartmentId,
		String toDepartmentName,
		Long fromPositionId,
		String fromPositionName,
		Long toPositionId,
		String toPositionName,
		LocalDate appointmentDate,
		String reason,
		ApprovalStatus approvalStatus,
		String approverName,
		LocalDateTime approvedAt,
		String registeredByName
) {

	public static AppointmentResponse from(EmployeeAppointment a) {
		Department fromDept = a.getFromDepartment();
		Department toDept = a.getToDepartment();
		Position fromPos = a.getFromPosition();
		Position toPos = a.getToPosition();
		Employee approver = a.getApprover();

		return new AppointmentResponse(
				a.getId(),
				a.getDocumentNumber(),
				a.getEmployee().getId(),
				a.getEmployee().getEmployeeNumber(),
				a.getEmployee().getName(),
				a.getAppointmentType(),
				fromDept != null ? fromDept.getId() : null,
				fromDept != null ? fromDept.getName() : null,
				toDept != null ? toDept.getId() : null,
				toDept != null ? toDept.getName() : null,
				fromPos != null ? fromPos.getId() : null,
				fromPos != null ? fromPos.getName() : null,
				toPos != null ? toPos.getId() : null,
				toPos != null ? toPos.getName() : null,
				a.getAppointmentDate(),
				a.getReason(),
				a.getApprovalStatus(),
				approver != null ? approver.getName() : null,
				a.getApprovedAt(),
				a.getRegisteredBy().getName()
		);
	}
}
