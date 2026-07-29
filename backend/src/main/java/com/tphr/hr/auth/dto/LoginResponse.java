package com.tphr.hr.auth.dto;

import com.tphr.hr.employee.EmployeeRole;

public record LoginResponse(
		String accessToken,
		String tokenType,
		Long employeeId,
		String employeeNumber,
		String name,
		String email,
		EmployeeRole role,
		Integer positionLevel,
		Long departmentId,
		String departmentName
) {

	public static LoginResponse of(String accessToken, Long employeeId, String employeeNumber, String name,
			String email, EmployeeRole role, Integer positionLevel, Long departmentId, String departmentName) {
		return new LoginResponse(accessToken, "Bearer", employeeId, employeeNumber, name, email, role, positionLevel, departmentId, departmentName);
	}
}
