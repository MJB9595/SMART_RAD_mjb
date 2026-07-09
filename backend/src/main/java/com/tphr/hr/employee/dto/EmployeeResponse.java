package com.tphr.hr.employee.dto;

import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRole;
import com.tphr.hr.employee.EmploymentStatus;
import java.time.LocalDate;

public record EmployeeResponse(
		Long id,
		String employeeNumber,
		String name,
		String email,
		String phone,
		Long departmentId,
		String departmentName,
		Long positionId,
		String positionName,
		Long employmentTypeId,
		String employmentTypeName,
		EmployeeRole role,
		EmploymentStatus employmentStatus,
		LocalDate hireDate,
		LocalDate resignDate
) {

	public static EmployeeResponse from(Employee employee) {
		return new EmployeeResponse(
				employee.getId(),
				employee.getEmployeeNumber(),
				employee.getName(),
				employee.getEmail(),
				employee.getPhone(),
				employee.getDepartment().getId(),
				employee.getDepartment().getName(),
				employee.getPosition().getId(),
				employee.getPosition().getName(),
				employee.getEmploymentType().getId(),
				employee.getEmploymentType().getName(),
				employee.getRole(),
				employee.getEmploymentStatus(),
				employee.getHireDate(),
				employee.getResignDate()
		);
	}
}
