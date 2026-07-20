package com.tphr.hr.records.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record LanguageRequest(

		@NotBlank(message = "언어는 필수입니다.")
		String languageName,

		String readingLevel,

		String writingLevel,

		String speakingLevel,

		String testName,

		String testScore,

		LocalDate issuedDate,

		String issuer
) {
}
