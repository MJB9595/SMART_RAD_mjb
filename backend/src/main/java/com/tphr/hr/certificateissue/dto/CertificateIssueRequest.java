package com.tphr.hr.certificateissue.dto;

import com.tphr.hr.certificateissue.CertificateType;
import jakarta.validation.constraints.NotNull;

public record CertificateIssueRequest(

		@NotNull(message = "사원은 필수입니다.")
		Long employeeId,

		@NotNull(message = "증명서종류는 필수입니다.")
		CertificateType certificateType,

		String purpose
) {
}
