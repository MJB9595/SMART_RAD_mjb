package com.tphr.hr.security;

import java.util.List;
import java.util.Set;

/**
 * 로그인 시점에 계산한 이 계정의 실제 접근 범위.
 *
 * <p>기존에는 employee.role 열거값 하나만 권한으로 썼고 role/permission 테이블은 화면 표시용으로만
 * 존재했다. 이제 employee_role → role(active) → role_permission → permission 을 실제로 읽어
 * 권한을 만든다. 그래서 권한 관리 화면에서 역할의 권한을 바꾸거나 역할을 비활성화하면
 * 다음 요청부터 곧바로 반영된다.
 *
 * @param roleCodes   활성 역할 코드 (ROLE_ADMIN 등). Spring Security 의 hasRole() 이 이걸 본다.
 * @param permissions 활성 역할이 가진 권한 코드 (EMPLOYEE_WRITE 등).
 * @param blocked     역할을 배정받았는데 전부 비활성이라 접근을 막아야 하는 상태.
 */
public record AccessProfile(List<String> roleCodes, Set<String> permissions, boolean blocked) {

	/** 접근 차단 시 사용자에게 보여줄 문구. 로그인·API 양쪽에서 같은 문구를 쓴다. */
	public static final String BLOCKED_MESSAGE = "비활성된 계정 / 권한 입니다. 관리자에게 문의해주세요.";

	/** 역할이 전부 비활성이라 접근을 막아야 하는 프로필. */
	public static AccessProfile denied() {
		return new AccessProfile(List.of(), Set.of(), true);
	}
}
