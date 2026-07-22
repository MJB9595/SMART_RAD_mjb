package com.tphr.hr.signup.dto;

import com.tphr.hr.common.StaffCategory;
import com.tphr.hr.employee.EmployeeRole;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/** 승인 자리(슬롯) 생성 — 사번/이메일/비밀번호 없이 직위·권한만 정의. */
public record SlotCreateRequest(

		@NotNull(message = "구분은 필수입니다.")
		StaffCategory staffCategory,

		@NotNull(message = "소속은 필수입니다.")
		Long departmentId,

		@NotNull(message = "직급은 필수입니다.")
		Long positionId,

		@NotNull(message = "임용구분은 필수입니다.")
		Long employmentTypeId,

		@NotNull(message = "권한은 필수입니다.")
		EmployeeRole role,

		LocalDate hireDate,

		String label
) {
}
