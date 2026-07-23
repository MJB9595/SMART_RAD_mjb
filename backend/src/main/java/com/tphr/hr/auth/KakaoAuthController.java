package com.tphr.hr.auth;

import com.tphr.hr.auth.dto.KakaoLoginRequest;
import com.tphr.hr.auth.dto.LoginResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/kakao")
@RequiredArgsConstructor
public class KakaoAuthController {

	private final KakaoAuthService kakaoAuthService;

	@PostMapping("/callback")
	public LoginResponse callback(@Valid @RequestBody KakaoLoginRequest request) {
		return kakaoAuthService.login(request.code());
	}
}
