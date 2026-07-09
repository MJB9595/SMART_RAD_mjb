package com.tphr.hr.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordChangeRequest(

		@NotBlank(message = "새 비밀번호는 필수입니다.")
		@Size(min = 4, message = "비밀번호는 4자 이상이어야 합니다.")
		String newPassword
) {
}
