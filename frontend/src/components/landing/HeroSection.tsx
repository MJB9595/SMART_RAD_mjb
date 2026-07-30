import { CheckCircle2, ChevronRight, BarChart3, Users, Calendar, LayoutDashboard, Clock, Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-white min-h-screen flex flex-col justify-center py-24 border-b border-slate-100">
			{/* Modern subtle grid background instead of generic blobs */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
			
			<div className="relative mx-auto w-full px-8 md:px-16 lg:px-24">
				<div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-32 xl:gap-48 items-center">
					{/* Left: Copy */}
					<div className="max-w-3xl mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
						<div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 mb-8 shadow-sm">
							<span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
							국내 최고 수준의 학교 특화 HR 솔루션
						</div>
						<h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-8 leading-[1.15]">
							학교 인사관리, <br />
							<span className="text-blue-600">데이터로 완벽하게</span>
						</h1>
						<p className="text-lg lg:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
							근태, 급여, 인사발령 등 파편화된 교무 업무를 하나로 통합합니다.<br className="hidden lg:block" />
							번거로운 행정 업무는 시스템에 맡기고 교육에 집중하세요.
						</p>
						
						<div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
							<Link
								href="/signup"
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg w-full sm:w-auto"
							>
								무료로 시작하기
								<ArrowRight className="h-4 w-4" />
							</Link>
							<Link
								href="/contact"
								className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50 w-full sm:w-auto"
							>
								도입 문의
							</Link>
						</div>

						<div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4 text-sm font-medium text-slate-400">
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4 text-emerald-500" />
								교육부 지침 완벽 준수
							</div>
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4 text-emerald-500" />
								보안 인증 완료
							</div>
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4 text-emerald-500" />
								무료 도입 컨설팅
							</div>
						</div>
					</div>

					{/* Right: Realistic UI Mockup */}
					<div className="relative mx-auto w-full max-w-xl lg:max-w-none hidden lg:block">
						<div className="relative rounded-2xl bg-white shadow-[0_20px_40px_rgb(0,0,0,0.06)] ring-1 ring-slate-100 flex flex-col h-[720px] overflow-hidden">
							{/* Browser Header */}
							<div className="flex items-center gap-4 border-b border-slate-100 bg-white px-4 py-3">
								<div className="flex gap-1.5">
									<div className="h-3 w-3 rounded-full bg-slate-200" />
									<div className="h-3 w-3 rounded-full bg-slate-200" />
									<div className="h-3 w-3 rounded-full bg-slate-200" />
								</div>
								<div className="flex-1">
									<div className="mx-auto h-6 w-full max-w-sm rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-[11px] text-slate-400 font-medium">
										<span className="text-slate-300 mr-1">🔒</span> admin.smart-rad.kr
									</div>
								</div>
							</div>
							
							{/* Real UI Feel Dashboard */}
							<div className="flex flex-1 overflow-hidden bg-slate-50/50">
								{/* Left Sidebar */}
								<div className="w-48 border-r border-slate-200 bg-white flex flex-col py-6 px-3 gap-1">
									<div className="px-3 mb-4 font-bold text-slate-900 flex items-center gap-2">
										<div className="w-6 h-6 rounded-md bg-[#1F3A8F] flex items-center justify-center flex-shrink-0">
											<svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
												<rect x="3" y="3" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.95" />
												<rect x="13" y="3" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.6" />
												<rect x="3" y="13" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.6" />
												<rect x="13" y="13" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.95" />
											</svg>
										</div>
										TSM
									</div>
									
									<div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm">
										<LayoutDashboard className="h-4 w-4" />
										대시보드
									</div>
									<div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 font-medium text-sm">
										<Users className="h-4 w-4" />
										인사 관리
									</div>
									<div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 font-medium text-sm">
										<Clock className="h-4 w-4" />
										근태 관리
									</div>
									<div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 font-medium text-sm">
										<Calculator className="h-4 w-4" />
										급여/정산
									</div>
								</div>
								
								{/* Main Content Area */}
								<div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
									<div className="flex justify-between items-center">
										<div>
											<div className="text-xl font-bold text-slate-900">대시보드</div>
											<div className="text-sm text-slate-500 mt-1">오늘의 주요 현황을 확인하세요.</div>
										</div>
									</div>
									
									<div className="grid grid-cols-2 gap-4">
										{/* Card 1 */}
										<div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
											<div className="text-sm font-medium text-slate-500 mb-2">출근 현황</div>
											<div className="flex items-end gap-2">
												<div className="text-3xl font-bold text-slate-900">128</div>
												<div className="text-sm font-medium text-slate-500 mb-1">/ 142명</div>
											</div>
											<div className="mt-3 text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md inline-block">
												지각 0명
											</div>
										</div>
										
										{/* Card 2 */}
										<div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
											<div className="text-sm font-medium text-slate-500 mb-2">휴가 신청 대기</div>
											<div className="flex items-end gap-2">
												<div className="text-3xl font-bold text-slate-900">4</div>
												<div className="text-sm font-medium text-slate-500 mb-1">건</div>
											</div>
											<div className="mt-3 text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md inline-block">
												확인 필요
											</div>
										</div>
									</div>
									
									<div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
										<div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800">
											최근 급여 정산
										</div>
										<div className="p-5 flex-1 flex flex-col gap-3">
											{[
												{ name: "2026년 6월 급여대장", status: "완료", color: "text-emerald-700 bg-emerald-50" },
												{ name: "2026년 5월 급여대장", status: "완료", color: "text-emerald-700 bg-emerald-50" },
												{ name: "2026년 4월 급여대장", status: "완료", color: "text-emerald-700 bg-emerald-50" },
											].map((item, i) => (
												<div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
													<div className="text-sm font-medium text-slate-700">{item.name}</div>
													<div className={`text-xs font-bold px-2 py-1 rounded-md ${item.color}`}>{item.status}</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
