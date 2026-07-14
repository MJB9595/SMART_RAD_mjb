package com.tphr.hr.employee.dto;

import com.tphr.hr.common.StaffCategory;
import com.tphr.hr.employee.EmployeeRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record EmployeeCreateRequest(

		@NotBlank(message = "사번은 필수입니다.")
		String employeeNumber,

		@NotBlank(message = "성명은 필수입니다.")
		String name,

		@NotBlank(message = "이메일은 필수입니다.")
		@Email(message = "이메일 형식이 올바르지 않습니다.")
		String email,

		@NotBlank(message = "비밀번호는 필수입니다.")
		@Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
		String password,

		String phone,

		@NotNull(message = "교직원 구분은 필수입니다.")
		StaffCategory staffCategory,

		@NotNull(message = "소속은 필수입니다.")
		Long departmentId,

		@NotNull(message = "직급은 필수입니다.")
		Long positionId,

		@NotNull(message = "임용구분은 필수입니다.")
		Long employmentTypeId,

		@NotNull(message = "권한은 필수입니다.")
		EmployeeRole role,

		@NotNull(message = "임용일은 필수입니다.")
		LocalDate hireDate,

		LocalDate birthDate,

		String gender,

		String address,

		String emergencyContact
) {
}
