"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Input } from "@/components/ui";

// 숫자 카운팅 애니메이션 컴포넌트
function AnimatedNumber({
  end,
  decimals = 0,
  suffix = "",
}: {
  end: number;
  decimals?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let startTime: number | undefined;
    let animationFrameId: number;
    const duration = 2000;

    const update = (timestamp: number): void => {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(end * easeProgress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end]);

  const formattedNumber =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString("ko-KR");

  return (
    <span>
      {formattedNumber}
      {suffix}
    </span>
  );
}

// 메인 페이지 컴포넌트
export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  const [domain, setDomain] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [kakaoLoading, setKakaoLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/employees");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/employees");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "로그인에 실패했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleKakaoLogin = (): void => {
    try {
      const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

      if (!clientId || !redirectUri) {
        setError("카카오 로그인 설정이 없습니다. 관리자에게 문의하세요.");
        console.error("Missing KAKAO environment variables");
        return;
      }

      setKakaoLoading(true);

      const kakaoAuthUrl = new URL("https://kauth.kakao.com/oauth/authorize");
      kakaoAuthUrl.searchParams.append("client_id", clientId);
      kakaoAuthUrl.searchParams.append("redirect_uri", redirectUri);
      kakaoAuthUrl.searchParams.append("response_type", "code");
      kakaoAuthUrl.searchParams.append("state", "school_hr_login");

      window.location.href = kakaoAuthUrl.toString();
    } catch (err) {
      setError("카카오 로그인 중 오류가 발생했습니다.");
      console.error("Kakao login error:", err);
      setKakaoLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* 1. 왼쪽 영역: 로그인 폼 */}
      <div className="flex w-full flex-col lg:w-1/2 bg-white relative">
        <header className="flex items-center px-8 py-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="bg-slate-900 text-white px-2 py-1 rounded text-sm">
              S
            </div>
            <span>TSM</span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-[460px]">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2 text-gray-900">
                다시 만나서 반가워요
              </h1>
              <p className="text-sm text-gray-500">
                아이디와 비밀번호를 입력하고 인사관리를 계속 이어가세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field label="회사 도메인">
                <Input
                  type="text"
                  placeholder="company.daouoffice.com"
                  value={domain}
                  onChange={(e) => setDomain(e.currentTarget.value)}
                  className="w-full h-12 min-h-[48px]"
                  autoFocus
                />
              </Field>

              <Field label="아이디">
                <Input
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className="w-full h-12 min-h-[48px]"
                  required
                />
              </Field>

              <Field label="비밀번호">
                <div className="relative w-full h-12 min-h-[48px]">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    className="w-full h-full min-h-[48px] pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 active:text-gray-800 focus:outline-none select-none p-1 z-10 transition-colors duration-150"
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                    title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </Field>

              <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  로그인 상태 유지
                </label>
                <Link href="/forgot" className="hover:text-gray-800">
                  아이디 · 비밀번호 찾기
                </Link>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="w-full h-12 min-h-[48px] text-base bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "로그인 중..." : "로그인"}
                </Button>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-gray-400">
                  또는
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleKakaoLogin}
                disabled={kakaoLoading}
                className="w-full h-12 min-h-[48px] bg-[#FEE500] hover:bg-[#FDD800] active:bg-[#FCCE00] disabled:opacity-70 disabled:cursor-not-allowed text-[#381E1E] font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 0C4.477 0 0 3.134 0 7c0 2.346 1.707 4.393 4.357 5.608-.086 1.385-.65 2.851-1.357 3.85.876-.266 2.431-.764 3.646-1.656 1.052.244 2.153.371 3.354.371 5.523 0 10-3.134 10-7s-4.477-7-10-7z"
                    fill="currentColor"
                  />
                </svg>
                <span>{kakaoLoading ? "로그인 중..." : "카카오로 로그인"}</span>
              </button>
            </form>

            <div className="mt-12 text-center text-sm text-gray-500">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="text-blue-600 font-medium hover:underline"
              >
                무료로 시작하기
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* 2. 오른쪽 영역: 배너 정보 */}
      <div className="hidden lg:flex w-1/2 bg-[#1a2133] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute -top-48 -right-48 w-[550px] h-[550px] bg-[#26314f] rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] bg-[#26314f] rounded-full"></div>

        <div className="relative z-10 max-w-[500px] text-white">
          <div className="text-blue-500 text-6xl font-serif mb-4 leading-none">
            &quot;
          </div>
          <h2 className="text-3xl font-bold mb-6 leading-tight">
            흩어진 인사 업무를
            <br />
            하나의 흐름으로 연결했어요
          </h2>
          <p className="text-gray-400 text-sm mb-12 leading-relaxed">
            근태, 휴가, 급여, 인사정보까지, 매일 반복되는 관리 업무
            <br />를 자동화하고 임직원과의 신뢰를 함께 쌓아가세요.
          </p>

          {/* 개선된 통계 컨테이너 */}
          <div className="w-full max-w-[540px] mx-auto bg-[#21293e] border border-gray-700/50 rounded-xl p-8 shadow-lg">
            <div className="flex justify-around items-center gap-6">
              {/* 도입 기업 */}
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold mb-2 text-white font-mono">
                  <AnimatedNumber end={17000} suffix="+" />
                </div>
                <div className="text-xs text-gray-400 font-medium tracking-tight">
                  도입 기업
                </div>
              </div>

              {/* 구분선 */}
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-600/40 to-transparent"></div>

              {/* 업무 기능 */}
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold mb-2 text-white font-mono">
                  <AnimatedNumber end={35} suffix="종" />
                </div>
                <div className="text-xs text-gray-400 font-medium tracking-tight">
                  업무 기능
                </div>
              </div>

              {/* 구분선 */}
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-600/40 to-transparent"></div>

              {/* 서비스 안정성 */}
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold mb-2 text-white font-mono">
                  <AnimatedNumber end={99.9} decimals={1} suffix="%" />
                </div>
                <div className="text-xs text-gray-400 font-medium tracking-tight">
                  서비스 안정성
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
