package com.tphr.hr.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record KakaoLoginRequest(
		@NotBlank String code
) {
}
