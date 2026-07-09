package com.tphr.hr.appointment.dto;

import com.tphr.hr.appointment.AppointmentType;
import com.tphr.hr.appointment.EmployeeAppointment;
import com.tphr.hr.department.Department;
import com.tphr.hr.position.Position;
import java.time.LocalDate;

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
		String registeredByName
) {

	public static AppointmentResponse from(EmployeeAppointment appointment) {
		Department fromDept = appointment.getFromDepartment();
		Department toDept = appointment.getToDepartment();
		Position fromPos = appointment.getFromPosition();
		Position toPos = appointment.getToPosition();

		return new AppointmentResponse(
				appointment.getId(),
				appointment.getDocumentNumber(),
				appointment.getEmployee().getId(),
				appointment.getEmployee().getEmployeeNumber(),
				appointment.getEmployee().getName(),
				appointment.getAppointmentType(),
				fromDept != null ? fromDept.getId() : null,
				fromDept != null ? fromDept.getName() : null,
				toDept != null ? toDept.getId() : null,
				toDept != null ? toDept.getName() : null,
				fromPos != null ? fromPos.getId() : null,
				fromPos != null ? fromPos.getName() : null,
				toPos != null ? toPos.getId() : null,
				toPos != null ? toPos.getName() : null,
				appointment.getAppointmentDate(),
				appointment.getReason(),
				appointment.getRegisteredBy().getName()
		);
	}
}
