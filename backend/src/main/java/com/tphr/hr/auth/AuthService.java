package com.tphr.hr.auth;

import com.tphr.hr.auth.dto.LoginRequest;
import com.tphr.hr.auth.dto.LoginResponse;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.security.CustomUserDetails;
import com.tphr.hr.security.JwtTokenProvider;
import com.tphr.hr.signup.SignupRequestRepository;
import com.tphr.hr.signup.SignupStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;
	private final SignupRequestRepository signupRequestRepository;

	public LoginResponse login(LoginRequest request) {
		Authentication authentication;
		try {
			authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.email(), request.password()));
		} catch (AuthenticationException e) {
			// 정식 계정은 없지만 승인 대기 중인 신청이면, 자격증명 오류가 아니라 승인 대기임을 안내
			if (signupRequestRepository.existsByEmailAndStatusAndDeletedFalse(request.email(), SignupStatus.PENDING)) {
				throw ApiException.forbidden("승인 대기 중인 계정입니다. 관리자 승인 후 로그인할 수 있습니다.");
			}
			throw e;
		}

		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		Employee employee = userDetails.getEmployee();

		String token = jwtTokenProvider.createToken(employee.getId(), employee.getEmail(), employee.getRole().name());

		return LoginResponse.of(token, employee.getId(), employee.getEmployeeNumber(), employee.getName(),
				employee.getEmail(), employee.getRole());
	}
}
