package com.tphr.hr.position.dto;

import jakarta.validation.constraints.NotBlank;

public record PositionRequest(

		@NotBlank(message = "직급명은 필수입니다.")
		String name,

		int sortOrder
) {
}
