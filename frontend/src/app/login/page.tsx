"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import { startKakaoLogin } from "@/lib/auth/kakao";
import type { AuthUser } from "@/lib/types/auth";
import { Button, Field, Input } from "@/components/ui";

const HARDCODED_DEMO_USERS: AuthUser[] = [
  { employeeId: 1, employeeNumber: "ADM001", name: "관리자", email: "admin", role: "ADMIN", positionLevel: null, departmentId: null, departmentName: null },
  { employeeId: 2, employeeNumber: "FAC001", name: "김정교", email: "prof.kim@tphr.com", role: "EMPLOYEE", positionLevel: 1, departmentId: 6, departmentName: "컴퓨터공학과" },
  { employeeId: 3, employeeNumber: "FAC002", name: "이부교", email: "assoc.lee@tphr.com", role: "EMPLOYEE", positionLevel: 2, departmentId: 6, departmentName: "컴퓨터공학과" },
  { employeeId: 4, employeeNumber: "FAC003", name: "박강사", email: "lect.park@tphr.com", role: "EMPLOYEE", positionLevel: 4, departmentId: 7, departmentName: "전자공학과" },
  { employeeId: 5, employeeNumber: "FAC004", name: "최조교수", email: "assist.choi@tphr.com", role: "EMPLOYEE", positionLevel: 3, departmentId: 9, departmentName: "국어국문학과" },
  { employeeId: 6, employeeNumber: "STA001", name: "정직원", email: "staff.jung@tphr.com", role: "EMPLOYEE", positionLevel: 7, departmentId: 3, departmentName: "인사팀" },
  { employeeId: 7, employeeNumber: "STA002", name: "한주임", email: "staff.han@tphr.com", role: "EMPLOYEE", positionLevel: 8, departmentId: 2, departmentName: "총무처" }
];

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

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [kakaoLoading, setKakaoLoading] = useState<boolean>(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'USER'>('ADMIN');
  const [empNumber, setEmpNumber] = useState<string>("");
  const [demoUsers, setDemoUsers] = useState<AuthUser[]>([]);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/employees");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setDemoUsers(HARDCODED_DEMO_USERS);
  }, []);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setEmpNumber("");
  }, [selectedRole]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#1a2133] text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">인증 상태를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (selectedRole === 'USER' && !empNumber) {
      setError("사원 번호를 입력해주세요.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      if (selectedRole === 'ADMIN') {
        router.replace("/employees");
      } else {
        router.replace("/attendance");
      }
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
      setError(null);
      setKakaoLoading(true);
      startKakaoLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "카카오 로그인 중 오류가 발생했습니다.");
      setKakaoLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* 1. 왼쪽 영역: 로그인 폼 */}
      <div className="flex w-full flex-col lg:w-1/2 bg-white text-gray-900 dark:text-gray-900 relative">
        <header className="flex items-center px-8 py-6">
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
                다시 만나서 반가워요
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                아이디와 비밀번호를 입력하고 인사관리를 계속 이어가세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off">
              {/* 접속 유형 탭 */}
              <div className="flex bg-gray-100 p-1 rounded-lg mb-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('ADMIN')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200 ${
                    selectedRole === 'ADMIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  관리자
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('USER')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200 ${
                    selectedRole === 'USER' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  일반 회원
                </button>
              </div>

              <div className="animate-in fade-in slide-in-from-top-2 mb-2">
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border border-gray-200 p-2 rounded-lg bg-gray-50 shadow-inner">
                  {demoUsers.length === 0 ? (
                    <div className="text-sm text-gray-500 p-4 text-center">목록을 불러오는 중...</div>
                  ) : (
                    demoUsers
                      .filter(u => selectedRole === 'ADMIN' ? u.role === 'ADMIN' : u.role === 'EMPLOYEE')
                      .map(u => (
                      <button
                        key={u.employeeId}
                        type="button"
                        onClick={() => {
                          setEmail(u.email);
                          if (selectedRole === 'USER') {
                            setEmpNumber(u.employeeNumber);
                          }
                          setPassword(selectedRole === 'ADMIN' ? "admin1234" : "user1234");
                        }}
                        className="flex justify-between items-center p-3 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-md text-left transition-all text-sm group bg-white shadow-sm"
                      >
                        <div>
                          <span className="font-semibold text-gray-800 block group-hover:text-blue-700">{u.name}</span>
                          <span className="text-gray-500 text-xs">사원번호: {u.employeeNumber}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{u.email}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <Field label="아이디">
                <Input
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  className="w-full h-12 min-h-[48px]"
                  required
                  autoFocus
                  autoComplete="off"
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
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
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

              {selectedRole === 'USER' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <Field label="사원 번호">
                    <Input
                      type="text"
                      placeholder="사원 번호를 입력하세요"
                      value={empNumber}
                      onChange={(e) => setEmpNumber(e.currentTarget.value)}
                      className="w-full h-12 min-h-[48px]"
                      required
                    />
                  </Field>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-500 dark:text-gray-500">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                  />
                  로그인 상태 유지
                </label>
                <Link href="/forgot" className="hover:text-gray-800 dark:hover:text-gray-800">
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
                <div className="flex-grow border-t border-gray-200 dark:border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-gray-400 dark:text-gray-400">또는</span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-200"></div>
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

            <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="text-blue-600 dark:text-blue-600 font-medium hover:underline"
              >
                회원가입 신청 하기
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
