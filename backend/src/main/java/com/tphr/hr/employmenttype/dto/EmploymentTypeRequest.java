package com.tphr.hr.employmenttype.dto;

import jakarta.validation.constraints.NotBlank;

public record EmploymentTypeRequest(

		@NotBlank(message = "사원타입명은 필수입니다.")
		String name
) {
}
