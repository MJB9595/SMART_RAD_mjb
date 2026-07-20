package com.tphr.hr.records.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record FamilyRequest(

		@NotBlank(message = "가족성명은 필수입니다.")
		String familyName,

		@NotBlank(message = "관계는 필수입니다.")
		String familyRelation,

		LocalDate birthDate,

		String job,

		Boolean livingTogether,

		Boolean dependent,

		Boolean disabled
) {
}
