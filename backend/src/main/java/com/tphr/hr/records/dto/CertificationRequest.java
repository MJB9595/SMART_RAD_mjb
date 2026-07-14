package com.tphr.hr.records.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record CertificationRequest(

		@NotBlank(message = "자격증명은 필수입니다.")
		String name,

		String issuer,

		String certNumber,

		LocalDate acquiredDate,

		LocalDate expiryDate
) {
}
