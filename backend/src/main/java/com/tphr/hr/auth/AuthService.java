package com.tphr.hr.auth;

import com.tphr.hr.auth.dto.LoginRequest;
import com.tphr.hr.auth.dto.LoginResponse;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.security.CustomUserDetails;
import com.tphr.hr.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;

	public LoginResponse login(LoginRequest request) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.email(), request.password()));

		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
		Employee employee = userDetails.getEmployee();

		String token = jwtTokenProvider.createToken(employee.getId(), employee.getEmail(), employee.getRole().name());

		return LoginResponse.of(token, employee.getId(), employee.getEmployeeNumber(), employee.getName(),
				employee.getEmail(), employee.getRole());
	}
}
