package com.tphr.hr.department.dto;

import com.tphr.hr.department.OrgType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record DepartmentRequest(

		@NotBlank(message = "조직명은 필수입니다.")
		String name,

		@NotNull(message = "조직유형은 필수입니다.")
		OrgType orgType,

		Long parentDepartmentId,

		@PositiveOrZero(message = "정원은 0 이상이어야 합니다.")
		int headcount
) {
}
