package com.tphr.hr.auth;

import com.tphr.hr.auth.dto.LoginRequest;
import com.tphr.hr.auth.dto.LoginResponse;
import com.tphr.hr.auth.dto.UserResponse;
import com.tphr.hr.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/login")
	public LoginResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}

	/** 현재 토큰으로 인증된 사용자 정보 반환. 프론트 세션 검증에 사용. 유효 토큰이 없으면 401. */
	@GetMapping("/me")
	public UserResponse me(@AuthenticationPrincipal CustomUserDetails userDetails) {
		return UserResponse.from(userDetails.getEmployee());
	}
}
