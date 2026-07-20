package com.tphr.hr.auth.dto;

import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRole;

/** 현재 인증된 사용자 정보 (토큰 검증용 /auth/me 응답). */
public record UserResponse(
		Long employeeId,
		String employeeNumber,
		String name,
		String email,
		EmployeeRole role
) {

	public static UserResponse from(Employee employee) {
		return new UserResponse(employee.getId(), employee.getEmployeeNumber(), employee.getName(),
				employee.getEmail(), employee.getRole());
	}
}
