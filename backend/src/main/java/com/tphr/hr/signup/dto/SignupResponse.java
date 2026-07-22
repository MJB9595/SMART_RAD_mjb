package com.tphr.hr.signup.dto;

import com.tphr.hr.signup.SignupRequest;
import java.time.LocalDateTime;

/** 승인 대기 목록 항목. */
public record SignupResponse(
		Long id,
		String name,
		String email,
		String school,
		LocalDateTime requestedAt
) {

	public static SignupResponse from(SignupRequest s) {
		return new SignupResponse(s.getId(), s.getName(), s.getEmail(), s.getSchool(), s.getRequestedAt());
	}
}
