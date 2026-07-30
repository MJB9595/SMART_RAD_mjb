package com.tphr.hr.auth;

import com.tphr.hr.auth.dto.LoginRequest;
import com.tphr.hr.auth.dto.LoginResponse;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.security.AccessProfile;
import com.tphr.hr.security.AccessProfileService;
import com.tphr.hr.security.CustomUserDetails;
import com.tphr.hr.security.JwtTokenProvider;
import com.tphr.hr.signup.SignupRequestRepository;
import com.tphr.hr.signup.SignupStatus;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;
	private final SignupRequestRepository signupRequestRepository;
	private final AccessProfileService accessProfileService;

	public LoginResponse login(LoginRequest request) {
		Authentication authentication;
		try {
			authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.email(), request.password()));
		} catch (DisabledException e) {
			// 역할이 전부 비활성화된 계정 — 자격증명은 맞지만 접근을 막는다
			throw ApiException.forbidden(AccessProfile.BLOCKED_MESSAGE);
		} catch (AuthenticationException e) {
			// 정식 계정은 없지만 승인 대기 중인 신청이면, 자격증명 오류가 아니라 승인 대기임을 안내
			if (signupRequestRepository.existsByEmailAndStatusAndDeletedFalse(request.email(), SignupStatus.PENDING)) {
				throw ApiException.forbidden("승인 대기 중인 계정입니다. 관리자 승인 후 로그인할 수 있습니다.");
			}
			throw e;
		}

		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		return issueToken(userDetails.getEmployee());
	}

	public LoginResponse issueToken(Employee employee) {
		AccessProfile profile = accessProfileService.resolve(employee);
		// 카카오 로그인 등 authenticationManager 를 거치지 않는 경로도 동일하게 막는다
		if (profile.blocked()) {
			throw ApiException.forbidden(AccessProfile.BLOCKED_MESSAGE);
		}
		String token = jwtTokenProvider.createToken(
				employee.getId(),
				employee.getEmail(),
				employee.getRole().name()
		);

		return LoginResponse.of(
				token,
				employee.getId(),
				employee.getEmployeeNumber(),
				employee.getName(),
				employee.getEmail(),
				employee.getRole(),
				employee.getPosition() != null ? employee.getPosition().getSortOrder() : null,
				employee.getDepartment() != null ? employee.getDepartment().getId() : null,
				employee.getDepartment() != null ? employee.getDepartment().getName() : null,
				List.copyOf(profile.permissions())
		);
	}
}
