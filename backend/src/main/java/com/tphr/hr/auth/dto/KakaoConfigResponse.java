package com.tphr.hr.auth.dto;

/**
 * 브라우저가 카카오 인가 페이지로 보낼 때 필요한 값.
 *
 * <p>clientId(REST API 키)와 redirectUri 는 인가 URL 쿼리로 그대로 노출되는 공개 값이라
 * 내려줘도 된다. client-secret 은 토큰 교환 시 서버에서만 쓰므로 절대 포함하지 않는다.
 *
 * @param configured 서버에 카카오 설정이 들어와 있는지. false 면 화면에서 버튼을 감춘다.
 */
public record KakaoConfigResponse(boolean configured, String clientId, String redirectUri) {

	public static KakaoConfigResponse notConfigured() {
		return new KakaoConfigResponse(false, null, null);
	}
}
