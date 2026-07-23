"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { KAKAO_OAUTH_STATE_KEY } from "@/lib/auth/kakao";

export default function KakaoCallbackPage() {
	const router = useRouter();
	const { loading, loginWithKakao } = useAuth();
	const started = useRef(false);
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState<string | null>(null);

	useEffect(() => {
		// 기존 토큰 검증이 끝난 뒤 시작해, 이전 토큰 정리가 새 로그인 토큰을 지우는 경쟁 상태를 막는다.
		if (loading) return;

		// React 개발 모드에서 effect가 다시 실행되어 일회용 인가 코드를 중복 사용하지 않도록 한다.
		if (started.current) return;
		started.current = true;

		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		const state = params.get("state");
		const kakaoError = params.get("error");
		const savedState = window.sessionStorage.getItem(KAKAO_OAUTH_STATE_KEY);

		window.sessionStorage.removeItem(KAKAO_OAUTH_STATE_KEY);

		void Promise.resolve()
			.then(() => {
				if (kakaoError) {
					throw new Error("카카오 로그인이 취소되었거나 승인되지 않았습니다.");
				}
				if (!code || !state || state !== savedState) {
					throw new Error("유효하지 않은 카카오 로그인 요청입니다. 다시 시도해 주세요.");
				}
				return loginWithKakao(code);
			})
			.then((result) => {
				if (result.status === "PENDING_APPROVAL") {
					// 새 이메일 → 회원가입 승인 대기큐로 유입됨. 로그인 대신 안내.
					setPending(
						result.message ??
							"회원가입 승인 요청이 접수되었습니다. 관리자 승인 후 이용할 수 있습니다.",
					);
				} else {
					router.replace("/employees");
				}
			})
			.catch((loginError: unknown) => {
				setError(
					loginError instanceof Error
						? loginError.message
						: "카카오 로그인 처리에 실패했습니다.",
				);
			});
	}, [loading, loginWithKakao, router]);

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#1a2133] px-6 text-white">
			<section className="w-full max-w-md rounded-2xl bg-white p-8 text-center text-slate-900 shadow-2xl">
				{error ? (
					<>
						<h1 className="text-xl font-bold">카카오 로그인 실패</h1>
						<p className="mt-3 text-sm leading-6 text-slate-600" role="alert">
							{error}
						</p>
						<Link
							href="/login"
							className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
						>
							로그인 화면으로 돌아가기
						</Link>
					</>
				) : pending ? (
					<>
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-2xl" aria-hidden="true">
							⏳
						</div>
						<h1 className="mt-4 text-xl font-bold">회원가입 승인 대기</h1>
						<p className="mt-3 text-sm leading-6 text-slate-600" aria-live="polite">
							{pending}
						</p>
						<Link
							href="/login"
							className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
						>
							로그인 화면으로 돌아가기
						</Link>
					</>
				) : (
					<>
						<div
							className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"
							aria-hidden="true"
						/>
						<h1 className="mt-5 text-lg font-bold">카카오 로그인 처리 중</h1>
						<p className="mt-2 text-sm text-slate-500" aria-live="polite">
							잠시만 기다려 주세요.
						</p>
					</>
				)}
			</section>
		</main>
	);
}
