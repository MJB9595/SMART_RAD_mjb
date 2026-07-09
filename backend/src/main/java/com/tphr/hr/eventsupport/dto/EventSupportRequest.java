package com.tphr.hr.eventsupport.dto;

import com.tphr.hr.eventsupport.EventType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EventSupportRequest(

		@NotNull(message = "사원은 필수입니다.")
		Long employeeId,

		@NotNull(message = "경조유형은 필수입니다.")
		EventType eventType,

		@NotNull(message = "지원금액은 필수입니다.")
		@Positive(message = "지원금액은 0보다 커야 합니다.")
		BigDecimal amount,

		@NotNull(message = "경조일자는 필수입니다.")
		LocalDate eventDate,

		String description
) {
}
