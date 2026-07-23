package com.tphr.hr.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** 직원 본인 비밀번호 변경 — 현재 비밀번호 검증 포함. */
public record SelfPasswordChangeRequest(

		@NotBlank(message = "현재 비밀번호는 필수입니다.")
		String currentPassword,

		@NotBlank(message = "새 비밀번호는 필수입니다.")
		@Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
		String newPassword
) {
}
