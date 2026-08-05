import { apiFetch } from "@/lib/api/client";

export const KAKAO_OAUTH_STATE_KEY = "tp-hr:kakao-oauth-state";

interface KakaoConfig {
	configured: boolean;
	clientId: string | null;
	redirectUri: string | null;
}

/**
 * 카카오 설정은 서버에서 런타임에 받아온다.
 *
 * <p>NEXT_PUBLIC_ 변수는 Next.js 가 빌드 시점에 번들로 구워 넣는다. 이미지를 한 번 만들어
 * 서버로 옮겨 쓰는 배포(docker-compose.vps.yml)에서는 서버 .env 를 아무리 채워도 번들
 * 안의 값이 바뀌지 않아, 대여서버에서 카카오 로그인이 계속 막혀 있었다. 서버에 물어보면
 * 같은 이미지를 어느 환경에 올려도 그 환경의 값으로 동작한다.
 *
 * <p>빌드 인자로 값을 넣어 굽는 기존 방식도 폴백으로 남겨 둔다(로컬 개발 편의).
 */
async function loadKakaoConfig(): Promise<KakaoConfig> {
	try {
		return await apiFetch<KakaoConfig>("/auth/kakao/config");
	} catch {
		const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? null;
		const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? null;
		return { configured: Boolean(clientId && redirectUri), clientId, redirectUri };
	}
}

export async function startKakaoLogin(): Promise<void> {
	const { configured, clientId, redirectUri } = await loadKakaoConfig();

	if (!configured || !clientId || !redirectUri) {
		throw new Error("카카오 로그인 설정이 없습니다. 관리자에게 문의하세요.");
	}

	const state = globalThis.crypto.randomUUID();
	window.sessionStorage.setItem(KAKAO_OAUTH_STATE_KEY, state);

	const authorizationUrl = new URL("https://kauth.kakao.com/oauth/authorize");
	authorizationUrl.searchParams.set("client_id", clientId);
	authorizationUrl.searchParams.set("redirect_uri", redirectUri);
	authorizationUrl.searchParams.set("response_type", "code");
	authorizationUrl.searchParams.set("state", state);

	window.location.assign(authorizationUrl.toString());
}
