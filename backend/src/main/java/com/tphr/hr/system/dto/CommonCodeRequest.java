package com.tphr.hr.system.dto;

import jakarta.validation.constraints.NotBlank;

public record CommonCodeRequest(

		@NotBlank(message = "그룹코드는 필수입니다.")
		String groupCode,

		@NotBlank(message = "코드는 필수입니다.")
		String code,

		@NotBlank(message = "코드명은 필수입니다.")
		String name,

		int sortOrder,

		String parentCode
) {
}
