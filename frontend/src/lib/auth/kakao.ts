export const KAKAO_OAUTH_STATE_KEY = "tp-hr:kakao-oauth-state";

export function startKakaoLogin(): void {
	const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
	const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

	if (!clientId || !redirectUri) {
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
