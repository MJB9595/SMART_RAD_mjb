import { BookOpen, Calendar, Users, ShieldCheck, Clock, Calculator, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function FeaturesGridSection() {
	return (
		<section className="min-h-screen flex flex-col justify-center py-24 bg-slate-50 border-b border-slate-100">
			<div className="mx-auto w-full px-8 md:px-16 lg:px-24">
				<div className="text-center max-w-3xl mx-auto mb-20">
					<div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-6">
						ALL-IN-ONE HR
					</div>
					<h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6 leading-tight">
						인사 업무의 모든 것,<br />
						하나의 시스템에서 완벽하게
					</h2>
					<p className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed">
						파편화된 서류와 엑셀을 버리세요. 출퇴근부터 급여 정산까지,<br className="hidden md:block" />
						학교에 필요한 모든 HR 기능이 유기적으로 연결됩니다.
					</p>
				</div>

				{/* Bento Grid Layout */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					
					{/* Bento 1: Large Card (Spans 2 columns) */}
					<div className="md:col-span-2 bg-white rounded-3xl p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center overflow-hidden relative group hover:shadow-md transition-shadow">
						<div className="flex-1 flex flex-col items-start z-10">
							<div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
								<Clock className="h-7 w-7" />
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-3">
								복잡한 교원 복무, 알아서 척척
							</h3>
							<p className="text-slate-500 font-medium leading-relaxed mb-6">
								교육청 지침에 맞춘 연가, 병가, 공가 자동 계산은 물론, 유연근무제까지 완벽하게 지원합니다. 더 이상 남은 연가를 수기로 계산하지 마세요.
							</p>
							<ul className="space-y-3 mb-8">
								<li className="flex items-center gap-2 text-sm font-semibold text-slate-700">
									<CheckCircle2 className="h-5 w-5 text-emerald-500" />
									NEIS 데이터 완벽 호환
								</li>
								<li className="flex items-center gap-2 text-sm font-semibold text-slate-700">
									<CheckCircle2 className="h-5 w-5 text-emerald-500" />
									초과근무 시간 자동 집계
								</li>
							</ul>
							<Link href="/attendance" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700">
								복무 관리 더 알아보기 <ArrowRight className="h-4 w-4" />
							</Link>
						</div>
						
						{/* Mockup inside the card */}
						<div className="w-full md:w-[280px] shrink-0 bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-inner mt-6 md:mt-0 z-10 translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
							<div className="text-sm font-bold text-slate-900 mb-4">오늘의 출퇴근</div>
							<div className="space-y-3">
								<div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
									<div className="text-sm font-semibold text-slate-700">김성민 교사</div>
									<div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">정상 출근</div>
								</div>
								<div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
									<div className="text-sm font-semibold text-slate-700">이수진 교사</div>
									<div className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">오후 반차</div>
								</div>
								<div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
									<div className="text-sm font-semibold text-slate-700">박지훈 주무관</div>
									<div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">정상 출근</div>
								</div>
							</div>
						</div>
					</div>

					{/* Bento 2: Standard Card */}
					<div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm flex flex-col relative group hover:shadow-md transition-shadow">
						<div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
							<Calculator className="h-7 w-7" />
						</div>
						<h3 className="text-2xl font-bold text-slate-900 mb-3">
							클릭 한 번에<br/>끝나는 급여 정산
						</h3>
						<p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
							복무 기록과 연동되어 초과근무 수당, 공제액이 자동으로 계산됩니다. 은행 전송용 엑셀까지 한 번에 추출하세요.
						</p>
						<Link href="/payroll" className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 mt-auto">
							급여 관리 더 알아보기 <ArrowRight className="h-4 w-4" />
						</Link>
					</div>

					{/* Bento 3: Standard Card */}
					<div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm flex flex-col relative group hover:shadow-md transition-shadow">
						<div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
							<Users className="h-7 w-7" />
						</div>
						<h3 className="text-2xl font-bold text-slate-900 mb-3">
							인사발령 이력 자동 추적
						</h3>
						<p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
							입사부터 퇴사까지. 승진, 파견, 전보 등 모든 인사발령 이력이 타임라인 형태로 꼼꼼하게 기록됩니다.
						</p>
						<div className="mt-auto flex -space-x-2">
							<div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">김</div>
							<div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">이</div>
							<div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">박</div>
							<div className="h-10 w-10 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-400 shadow-sm">+42</div>
						</div>
					</div>

					{/* Bento 4: Large Card (Spans 2 columns) */}
					<div className="md:col-span-2 bg-slate-900 rounded-3xl p-10 shadow-lg flex flex-col md:flex-row gap-8 items-center overflow-hidden relative group">
						{/* Background grid for dark theme */}
						<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
						
						<div className="w-full md:w-[260px] shrink-0 bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl z-10 -translate-y-2 group-hover:-translate-y-4 transition-transform duration-500">
							<div className="flex items-center gap-3 mb-6">
								<ShieldCheck className="w-8 h-8 text-blue-400" />
								<div className="text-white font-bold">ISMS-P 인증</div>
							</div>
							<div className="space-y-4">
								<div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
									<div className="h-full bg-blue-500 w-full"></div>
								</div>
								<div className="text-xs font-medium text-slate-400">엔드투엔드 암호화 적용됨</div>
								<div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
									<div className="h-full bg-emerald-500 w-[80%]"></div>
								</div>
								<div className="text-xs font-medium text-slate-400">데이터 백업 다중화</div>
							</div>
						</div>

						<div className="flex-1 flex flex-col items-start z-10">
							<h3 className="text-2xl font-bold text-white mb-3">
								금융권 수준의 강력한 보안
							</h3>
							<p className="text-slate-400 font-medium leading-relaxed mb-6">
								교직원의 민감한 개인정보, 안심하고 맡기세요.<br/>
								망분리 환경 완벽 지원, 2단계 인증(2FA), 세밀한 권한 제어로 학교 데이터를 철통같이 지킵니다.
							</p>
							<Link href="/security" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm font-bold text-white hover:bg-slate-700 transition-colors">
								보안 백서 다운로드 <ArrowRight className="h-4 w-4 text-slate-400" />
							</Link>
						</div>
					</div>

				</div>
			</div>
		</section>
	);
}
