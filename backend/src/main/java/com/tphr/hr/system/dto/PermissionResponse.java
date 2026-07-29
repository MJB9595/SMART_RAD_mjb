package com.tphr.hr.system.dto;

import com.tphr.hr.system.Permission;

/** 역할에 부여할 수 있는 권한 목록 (권한 편집 화면용). */
public record PermissionResponse(Long id, String code, String name, String resource, String action) {

	public static PermissionResponse from(Permission p) {
		return new PermissionResponse(p.getId(), p.getCode(), p.getName(), p.getResource(), p.getAction());
	}
}
