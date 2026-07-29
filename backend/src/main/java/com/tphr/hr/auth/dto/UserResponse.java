package com.tphr.hr.auth.dto;

import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRole;

/** 현재 인증된 사용자 정보 (토큰 검증용 /auth/me 응답). */
public record UserResponse(
		Long employeeId,
		String employeeNumber,
		String name,
		String email,
		EmployeeRole role,
		Integer positionLevel,
		Long departmentId,
		String departmentName
) {

	public static UserResponse from(Employee employee) {
		return new UserResponse(
				employee.getId(),
				employee.getEmployeeNumber(),
				employee.getName(),
				employee.getEmail(),
				employee.getRole(),
				employee.getPosition() != null ? employee.getPosition().getSortOrder() : null,
				employee.getDepartment() != null ? employee.getDepartment().getId() : null,
				employee.getDepartment() != null ? employee.getDepartment().getName() : null
		);
	}
}
