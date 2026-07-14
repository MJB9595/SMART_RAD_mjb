package com.tphr.hr.security;

import com.tphr.hr.common.exception.ApiException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

	private SecurityUtils() {
	}

	public static Long getCurrentEmployeeId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
			throw ApiException.unauthorized("인증 정보가 없습니다.");
		}
		return userDetails.getEmployeeId();
	}
}
