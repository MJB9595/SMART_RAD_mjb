package com.tphr.hr.records.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CareerRequest(

		@NotBlank(message = "기관/회사명은 필수입니다.")
		String companyName,

		String department,

		String position,

		String jobDescription,

		@NotNull(message = "시작일은 필수입니다.")
		LocalDate startDate,

		LocalDate endDate
) {
}
