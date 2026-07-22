"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

// 회원가입 페이지 컴포넌트
export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    
    try {
      // TODO: 백엔드 회원가입 API 연동
      // await signup(name, email, password, company);
      
      // 임시 딜레이
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("회원가입 신청이 완료되었습니다.");
      router.push("/login");
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* 1. 왼쪽 영역: 회원가입 폼 */}
      <div className="flex w-full flex-col lg:w-1/2 bg-white text-gray-900 dark:text-gray-900 relative h-screen overflow-y-auto">
        <header className="flex flex-shrink-0 items-center px-8 py-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-gray-900 dark:text-gray-900">
            <div className="bg-slate-900 text-white px-2 py-1 rounded text-sm">
              S
            </div>
            <span>TSM</span>
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-[460px]">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-900">
                회원가입 신청하기
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                간단한 정보를 입력하고 흩어진 인사 업무를 하나로 연결하세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off">
              <Field label="이름">
                <Input
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  className="w-full h-12 min-h-[48px]"
                  required
                  autoFocus
                  autoComplete="off"
                />
              </Field>

              <Field label="이메일 / 아이디">
                <Input
                  type="email"
                  placeholder="user@company.com"
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
                    autoComplete="new-password"
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

              <Field label="비밀번호 확인">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 한 번 입력하세요"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
                  className="w-full h-12 min-h-[48px]"
                  required
                />
              </Field>

              <Field label="학교명">
                <Input
                  type="text"
                  placeholder="예: 대한대학교"
                  value={school}
                  onChange={(e) => setSchool(e.currentTarget.value)}
                  className="w-full h-12 min-h-[48px]"
                  required
                />
              </Field>

              {error && <p className="text-sm text-red-600 font-medium mt-1">{error}</p>}

              <div className="mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="w-full h-12 min-h-[48px] text-base bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "처리 중..." : "회원가입 신청"}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500 pb-8">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-600 font-medium hover:underline"
              >
                로그인 하기
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* 2. 오른쪽 영역: 배너 정보 (로그인 페이지와 동일) */}
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

          <div className="w-full max-w-[540px] mx-auto bg-[#21293e] border border-gray-700/50 rounded-xl p-8 shadow-lg">
            <div className="flex justify-around items-center gap-6">
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold mb-2 text-white font-mono">
                  <AnimatedNumber end={17000} suffix="+" />
                </div>
                <div className="text-xs text-gray-400 font-medium tracking-tight">
                  도입 기업
                </div>
              </div>

              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-600/40 to-transparent"></div>

              <div className="flex-1 text-center">
                <div className="text-4xl font-bold mb-2 text-white font-mono">
                  <AnimatedNumber end={35} suffix="종" />
                </div>
                <div className="text-xs text-gray-400 font-medium tracking-tight">
                  업무 기능
                </div>
              </div>

              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-600/40 to-transparent"></div>

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
