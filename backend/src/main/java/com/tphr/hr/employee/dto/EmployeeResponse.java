package com.tphr.hr.employee.dto;

import com.tphr.hr.common.StaffCategory;
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
		StaffCategory staffCategory,
		Long departmentId,
		String departmentName,
		Long positionId,
		String positionName,
		Long employmentTypeId,
		String employmentTypeName,
		EmployeeRole role,
		EmploymentStatus employmentStatus,
		LocalDate hireDate,
		LocalDate resignDate,
		LocalDate birthDate,
		String gender,
		String address,
		String emergencyContact,
		Long version
) {

	public static EmployeeResponse from(Employee employee) {
		return new EmployeeResponse(
				employee.getId(),
				employee.getEmployeeNumber(),
				employee.getName(),
				employee.getEmail(),
				employee.getPhone(),
				employee.getStaffCategory(),
				employee.getDepartment().getId(),
				employee.getDepartment().getName(),
				employee.getPosition().getId(),
				employee.getPosition().getName(),
				employee.getEmploymentType().getId(),
				employee.getEmploymentType().getName(),
				employee.getRole(),
				employee.getEmploymentStatus(),
				employee.getHireDate(),
				employee.getResignDate(),
				employee.getBirthDate(),
				employee.getGender(),
				employee.getAddress(),
				employee.getEmergencyContact(),
				employee.getVersion()
		);
	}
}
