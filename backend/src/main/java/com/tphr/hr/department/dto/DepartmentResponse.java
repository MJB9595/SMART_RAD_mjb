package com.tphr.hr.department.dto;

import com.tphr.hr.department.Department;

public record DepartmentResponse(
		Long id,
		String name,
		Long parentDepartmentId,
		String parentDepartmentName,
		boolean active
) {

	public static DepartmentResponse from(Department department) {
		Department parent = department.getParentDepartment();
		return new DepartmentResponse(
				department.getId(),
				department.getName(),
				parent != null ? parent.getId() : null,
				parent != null ? parent.getName() : null,
				department.isActive()
		);
	}
}
