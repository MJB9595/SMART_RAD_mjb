package com.tphr.hr.employmenttype.dto;

import com.tphr.hr.employmenttype.EmploymentType;

public record EmploymentTypeResponse(
		Long id,
		String name,
		boolean active
) {

	public static EmploymentTypeResponse from(EmploymentType employmentType) {
		return new EmploymentTypeResponse(employmentType.getId(), employmentType.getName(), employmentType.isActive());
	}
}
