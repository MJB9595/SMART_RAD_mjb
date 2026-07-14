package com.tphr.hr.attendance.dto;

import com.tphr.hr.attendance.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceRequest(

		@NotNull(message = "사원은 필수입니다.")
		Long employeeId,

		@NotNull(message = "근무일은 필수입니다.")
		LocalDate workDate,

		LocalTime checkInTime,

		LocalTime checkOutTime,

		@NotNull(message = "근태상태는 필수입니다.")
		AttendanceStatus status
) {
}
