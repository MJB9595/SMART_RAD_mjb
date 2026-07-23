package com.tphr.hr.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record KakaoUserResponse(
		Long id,
		@JsonProperty("kakao_account") KakaoAccount account
) {

	@JsonIgnoreProperties(ignoreUnknown = true)
	public record KakaoAccount(
			String email,
			@JsonProperty("is_email_valid") Boolean emailValid,
			@JsonProperty("is_email_verified") Boolean emailVerified,
			Profile profile
	) {

		@JsonIgnoreProperties(ignoreUnknown = true)
		public record Profile(String nickname) {
		}
	}
}
