package com.tphr.hr.position.dto;

import com.tphr.hr.position.PositionCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PositionRequest(

		@NotBlank(message = "직급명은 필수입니다.")
		String name,

		@NotNull(message = "직급구분은 필수입니다.")
		PositionCategory category,

		int sortOrder
) {
}
