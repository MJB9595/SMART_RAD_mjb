package com.tphr.hr.signup;

import com.tphr.hr.security.SecurityUtils;
import com.tphr.hr.signup.dto.ApproveRequest;
import com.tphr.hr.signup.dto.SignupCreateRequest;
import com.tphr.hr.signup.dto.SignupResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class SignupController {

	private final SignupService signupService;

	/** 회원가입 신청 (공개). */
	@PostMapping("/signup")
	@ResponseStatus(HttpStatus.CREATED)
	public void signup(@Valid @RequestBody SignupCreateRequest request) {
		signupService.request(request);
	}

	/** 승인 대기 목록 (관리자). */
	@GetMapping("/signups/pending")
	@PreAuthorize("hasRole('ADMIN')")
	public List<SignupResponse> pending() {
		return signupService.getPending();
	}

	/** 승인 = 신청건 ↔ 자리(슬롯) 매칭 → 로그인 가능한 교직원 계정 생성 (관리자). */
	@PostMapping("/signups/{id}/approve")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void approve(@PathVariable Long id, @Valid @RequestBody ApproveRequest request) {
		signupService.approve(id, request.slotId(), SecurityUtils.getCurrentEmployeeId());
	}

	/** 거절 (관리자). */
	@PostMapping("/signups/{id}/reject")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void reject(@PathVariable Long id) {
		signupService.reject(id, SecurityUtils.getCurrentEmployeeId());
	}
}
