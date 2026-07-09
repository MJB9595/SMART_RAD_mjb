package com.tphr.hr.appointment.dto;

import com.tphr.hr.appointment.AppointmentType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AppointmentRequest(

		@NotNull(message = "사원은 필수입니다.")
		Long employeeId,

		@NotNull(message = "발령구분은 필수입니다.")
		AppointmentType appointmentType,

		Long fromDepartmentId,

		Long toDepartmentId,

		Long fromPositionId,

		Long toPositionId,

		@NotNull(message = "발령일자는 필수입니다.")
		LocalDate appointmentDate,

		String reason
) {
}
