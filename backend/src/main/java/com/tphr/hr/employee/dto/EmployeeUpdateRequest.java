package com.tphr.hr.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EmployeeUpdateRequest(

		@NotBlank(message = "성명은 필수입니다.")
		String name,

		String phone,

		@NotNull(message = "소속은 필수입니다.")
		Long departmentId,

		@NotNull(message = "직급은 필수입니다.")
		Long positionId,

		@NotNull(message = "임용구분은 필수입니다.")
		Long employmentTypeId,

		String address,

		String emergencyContact
) {
}
