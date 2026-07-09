package com.tphr.hr.department.dto;

import jakarta.validation.constraints.NotBlank;

public record DepartmentRequest(

		@NotBlank(message = "부서명은 필수입니다.")
		String name,

		Long parentDepartmentId
) {
}
