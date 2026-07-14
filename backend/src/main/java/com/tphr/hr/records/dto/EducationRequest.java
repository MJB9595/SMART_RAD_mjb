package com.tphr.hr.records.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record EducationRequest(

		@NotBlank(message = "학교명은 필수입니다.")
		String schoolName,

		String major,

		String degree,

		LocalDate admissionDate,

		LocalDate graduationDate,

		String status
) {
}
