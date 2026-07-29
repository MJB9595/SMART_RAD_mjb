package com.tphr.hr.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.Set;

/** 역할 생성/수정 요청. 수정 시 code는 무시된다(코드는 생성 후 불변). */
public record RoleRequest(

		@NotBlank(message = "역할 코드는 필수입니다.")
		@Pattern(regexp = "^ROLE_[A-Z0-9_]{2,40}$",
				message = "역할 코드는 ROLE_ 로 시작하는 영문 대문자/숫자/_ 조합이어야 합니다. (예: ROLE_MANAGER)")
		String code,

		@NotBlank(message = "역할 이름은 필수입니다.")
		String name,

		String description,

		/** 부여할 권한 코드 목록. 비어 있으면 권한 없음. */
		Set<String> permissionCodes
) {
}
