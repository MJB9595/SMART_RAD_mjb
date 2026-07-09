package com.tphr.hr.department.dto;

import java.util.List;

public record DepartmentTreeResponse(
		Long id,
		String name,
		List<DepartmentTreeResponse> children
) {
}
