package com.tphr.hr.auth.client;

import com.tphr.hr.auth.dto.KakaoTokenResponse;
import com.tphr.hr.auth.dto.KakaoUserResponse;
import com.tphr.hr.common.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Component
public class KakaoOAuthClient {

	private final RestClient restClient;
	private final String clientId;
	private final String clientSecret;
	private final String redirectUri;
	private final String tokenUri;
	private final String userInfoUri;

	public KakaoOAuthClient(
			RestClient.Builder restClientBuilder,
			@Value("${kakao.client-id:}") String clientId,
			@Value("${kakao.client-secret:}") String clientSecret,
			@Value("${kakao.redirect-uri}") String redirectUri,
			@Value("${kakao.token-uri}") String tokenUri,
			@Value("${kakao.user-info-uri}") String userInfoUri
	) {
		this.restClient = restClientBuilder.build();
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectUri = redirectUri;
		this.tokenUri = tokenUri;
		this.userInfoUri = userInfoUri;
	}

	public KakaoTokenResponse exchangeCode(String code) {
		ensureConfigured();

		MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
		form.add("grant_type", "authorization_code");
		form.add("client_id", clientId);
		form.add("redirect_uri", redirectUri);
		form.add("code", code);
		if (StringUtils.hasText(clientSecret)) {
			form.add("client_secret", clientSecret);
		}

		try {
			KakaoTokenResponse response = restClient.post()
					.uri(tokenUri)
					.contentType(MediaType.APPLICATION_FORM_URLENCODED)
					.body(form)
					.retrieve()
					.body(KakaoTokenResponse.class);

			if (response == null || !StringUtils.hasText(response.accessToken())) {
				throw ApiException.unauthorized("카카오에서 유효한 인증 토큰을 받지 못했습니다.");
			}
			return response;
		} catch (RestClientResponseException e) {
			throw ApiException.unauthorized("카카오 인증 코드가 유효하지 않거나 만료되었습니다.");
		} catch (RestClientException e) {
			throw new ApiException(HttpStatus.BAD_GATEWAY, "카카오 인증 서버에 연결할 수 없습니다.");
		}
	}

	public KakaoUserResponse getUser(String kakaoAccessToken) {
		try {
			KakaoUserResponse response = restClient.get()
					.uri(userInfoUri)
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + kakaoAccessToken)
					.retrieve()
					.body(KakaoUserResponse.class);

			if (response == null) {
				throw new ApiException(HttpStatus.BAD_GATEWAY, "카카오 사용자 응답이 비어 있습니다.");
			}
			return response;
		} catch (RestClientResponseException e) {
			throw ApiException.unauthorized("카카오 사용자 정보를 확인할 수 없습니다.");
		} catch (RestClientException e) {
			throw new ApiException(HttpStatus.BAD_GATEWAY, "카카오 사용자 정보 서버에 연결할 수 없습니다.");
		}
	}

	private void ensureConfigured() {
		if (!StringUtils.hasText(clientId) || !StringUtils.hasText(redirectUri)) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "카카오 로그인 설정이 완료되지 않았습니다.");
		}
	}
}
