package com.tphr.hr.system.dto;

import com.tphr.hr.system.CommonCode;

public record CommonCodeResponse(
		Long id,
		String groupCode,
		String code,
		String name,
		int sortOrder,
		String parentCode,
		boolean active
) {

	public static CommonCodeResponse from(CommonCode c) {
		return new CommonCodeResponse(c.getId(), c.getGroupCode(), c.getCode(), c.getName(), c.getSortOrder(),
				c.getParentCode(), c.isActive());
	}
}
