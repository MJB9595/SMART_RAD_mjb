package com.tphr.hr.auth.dto;

/**
 * 카카오 로그인 결과.
 * - LOGGED_IN: 기존/연동된 계정으로 로그인 완료 (login 채워짐)
 * - PENDING_APPROVAL: 새 이메일이라 회원가입 승인 대기큐로 유입됨 (message 안내)
 */
public record KakaoLoginResult(KakaoLoginStatus status, LoginResponse login, String message) {

	public enum KakaoLoginStatus {
		LOGGED_IN,
		PENDING_APPROVAL
	}

	public static KakaoLoginResult loggedIn(LoginResponse login) {
		return new KakaoLoginResult(KakaoLoginStatus.LOGGED_IN, login, null);
	}

	public static KakaoLoginResult pendingApproval(String message) {
		return new KakaoLoginResult(KakaoLoginStatus.PENDING_APPROVAL, null, message);
	}
}
