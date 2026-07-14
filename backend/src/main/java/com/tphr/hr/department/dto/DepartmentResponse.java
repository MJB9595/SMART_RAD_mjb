package com.tphr.hr.department.dto;

import com.tphr.hr.department.Department;
import com.tphr.hr.department.OrgType;

public record DepartmentResponse(
		Long id,
		String name,
		OrgType orgType,
		Long parentDepartmentId,
		String parentDepartmentName,
		int headcount,
		boolean active
) {

	public static DepartmentResponse from(Department department) {
		Department parent = department.getParentDepartment();
		return new DepartmentResponse(
				department.getId(),
				department.getName(),
				department.getOrgType(),
				parent != null ? parent.getId() : null,
				parent != null ? parent.getName() : null,
				department.getHeadcount(),
				department.isActive()
		);
	}
}
