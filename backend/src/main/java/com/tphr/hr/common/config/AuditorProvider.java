package com.tphr.hr.common.config;

import com.tphr.hr.security.CustomUserDetails;
import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/** created_by/updated_by 를 현재 로그인 사용자로 채운다. */
@Component
public class AuditorProvider implements AuditorAware<Long> {

	@Override
	public Optional<Long> getCurrentAuditor() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
			return Optional.empty();
		}
		return Optional.of(userDetails.getEmployeeId());
	}
}
