package com.tphr.hr.leave.dto;

import com.tphr.hr.leave.LeaveType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record LeaveRequestCreate(

		@NotNull(message = "사원은 필수입니다.")
		Long employeeId,

		@NotNull(message = "휴가유형은 필수입니다.")
		LeaveType leaveType,

		@NotNull(message = "시작일은 필수입니다.")
		LocalDate startDate,

		@NotNull(message = "종료일은 필수입니다.")
		LocalDate endDate,

		@NotNull(message = "일수는 필수입니다.")
		@Positive(message = "일수는 0보다 커야 합니다.")
		BigDecimal days,

		String reason
) {
}
