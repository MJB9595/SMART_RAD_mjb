package com.tphr.hr.auth;

import com.tphr.hr.auth.dto.KakaoConfigResponse;
import com.tphr.hr.auth.dto.KakaoLoginRequest;
import com.tphr.hr.auth.dto.KakaoLoginResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/kakao")
@RequiredArgsConstructor
public class KakaoAuthController {

	private final KakaoAuthService kakaoAuthService;

	@Value("${kakao.client-id:}")
	private String clientId;

	@Value("${kakao.redirect-uri:}")
	private String redirectUri;

	/**
	 * 카카오 인가 URL 을 만드는 데 필요한 값을 내려준다.
	 *
	 * <p>예전에는 프론트가 NEXT_PUBLIC_KAKAO_* 빌드 인자로 이 값을 받았는데, Next.js 는
	 * NEXT_PUBLIC_ 변수를 <b>빌드 시점에 번들로 굽는다</b>. 그래서 이미지를 한 번 구운 뒤
	 * 서버에서 환경변수만 채워 넣는 배포(docker-compose.vps.yml 처럼 전송된 이미지를 쓰는
	 * 방식)에서는 값이 끝내 비어 있어 "카카오 로그인 설정이 없습니다" 로 막혔다.
	 * 값을 런타임에 서버에서 받아오면 같은 이미지를 어느 환경에 올려도 동작하고,
	 * 설정 출처가 백엔드 한 곳으로 모여 프론트·백엔드 값이 어긋날 일도 없다.
	 */
	@GetMapping("/config")
	public KakaoConfigResponse config() {
		if (clientId == null || clientId.isBlank() || redirectUri == null || redirectUri.isBlank()) {
			return KakaoConfigResponse.notConfigured();
		}
		return new KakaoConfigResponse(true, clientId, redirectUri);
	}

	@PostMapping("/callback")
	public KakaoLoginResult callback(@Valid @RequestBody KakaoLoginRequest request) {
		return kakaoAuthService.login(request.code());
	}
}
