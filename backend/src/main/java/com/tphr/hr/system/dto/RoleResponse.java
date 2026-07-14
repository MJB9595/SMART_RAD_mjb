package com.tphr.hr.system.dto;

import com.tphr.hr.system.Permission;
import com.tphr.hr.system.Role;
import java.util.List;

public record RoleResponse(
		Long id,
		String code,
		String name,
		String description,
		boolean active,
		List<String> permissions
) {

	public static RoleResponse from(Role r) {
		List<String> perms = r.getPermissions().stream().map(Permission::getCode).sorted().toList();
		return new RoleResponse(r.getId(), r.getCode(), r.getName(), r.getDescription(), r.isActive(), perms);
	}
}
