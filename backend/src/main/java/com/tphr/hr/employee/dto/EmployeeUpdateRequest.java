package com.tphr.hr.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EmployeeUpdateRequest(

		@NotBlank(message = "이름은 필수입니다.")
		String name,

		String phone,

		@NotNull(message = "부서는 필수입니다.")
		Long departmentId,

		@NotNull(message = "직급은 필수입니다.")
		Long positionId,

		@NotNull(message = "사원타입은 필수입니다.")
		Long employmentTypeId
) {
}
