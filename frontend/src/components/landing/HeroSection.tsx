import { CheckCircle2, ChevronRight, BarChart3, Users, Calendar } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-slate-50 pt-16 md:pt-24 lg:pt-32 pb-16">
			<div className="mx-auto max-w-[1600px] px-8 md:px-16 lg:px-24">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
					<div className="max-w-2xl">
						<div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 mb-6">
							<CheckCircle2 className="h-4 w-4" />
							학교 전문 인사관리 플랫폼
						</div>
						<h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
							교직원 인사관리,<br />
							<span className="text-blue-600">이제 하나로 해결하세요</span>
						</h1>
						<p className="text-lg text-slate-600 mb-8 leading-relaxed">
							복무·평가·인사발령·급여를 하나로 연결해 학교 인사 업무의<br />
							비효율을 없앱니다. 교육부 지침이 바뀌어도 제도는 자동으로 업데이트됩니다.
						</p>
						
						<div className="flex flex-col sm:flex-row gap-4 mb-8">
							<Link
								href="/signup"
								className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
							>
								무료로 시작하기
							</Link>
							<Link
								href="/contact"
								className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
							>
								소개자료 받기
							</Link>
						</div>

						<div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4 text-slate-400" />
								교육부 지침 준수
							</div>
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4 text-slate-400" />
								전국 1,200+ 학교 도입
							</div>
							<div className="flex items-center gap-1.5">
								<CheckCircle2 className="h-4 w-4 text-slate-400" />
								무료 도입 컨설팅
							</div>
						</div>
					</div>

					{/* Right Side: Mockup */}
					<div className="relative mx-auto w-full max-w-lg lg:max-w-none hidden lg:block">
						<div className="relative rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/50 flex flex-col h-[400px] overflow-hidden">
							{/* Mockup Header */}
							<div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-4 py-3">
								<div className="flex gap-1.5">
									<div className="h-3 w-3 rounded-full bg-rose-400" />
									<div className="h-3 w-3 rounded-full bg-amber-400" />
									<div className="h-3 w-3 rounded-full bg-emerald-400" />
								</div>
								<div className="flex-1 text-center">
									<div className="mx-auto h-5 w-48 rounded bg-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-medium">
										schoolhr.co.kr
									</div>
								</div>
							</div>
							
							{/* Mockup Content - Simplified Dashboard */}
							<div className="flex flex-1 overflow-hidden bg-slate-50/50">
								{/* Sidebar */}
								<div className="w-16 border-r border-slate-100 bg-slate-900 flex flex-col items-center py-4 gap-6">
									<div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white">
										<Users className="h-4 w-4" />
									</div>
									<div className="flex flex-col gap-4 text-slate-400">
										<Calendar className="h-5 w-5" />
										<BarChart3 className="h-5 w-5" />
									</div>
								</div>
								
								{/* Main Content */}
								<div className="flex-1 p-6 flex flex-col gap-6">
									<div className="flex justify-between items-center">
										<div className="h-6 w-48 bg-slate-200 rounded-md"></div>
										<div className="h-6 w-24 bg-slate-200 rounded-md"></div>
									</div>
									
									{/* Stats Grid */}
									<div className="grid grid-cols-3 gap-4">
										{[1, 2, 3].map((i) => (
											<div key={i} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col gap-2">
												<div className="h-4 w-16 bg-slate-100 rounded"></div>
												<div className="h-8 w-12 bg-slate-200 rounded-md mt-auto"></div>
											</div>
										))}
									</div>

									{/* Chart Area */}
									<div className="flex-1 bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col">
										<div className="h-4 w-24 bg-slate-100 rounded mb-4"></div>
										<div className="flex-1 flex items-end gap-2">
											{[40, 70, 45, 90, 60].map((h, i) => (
												<div key={i} className={`flex-1 rounded-t-md ${i === 3 ? 'bg-blue-500' : 'bg-blue-100'}`} style={{ height: `${h}%` }}></div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
						
						{/* Decorative blur behind mockup */}
						<div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 opacity-50 blur-2xl"></div>
					</div>
				</div>
			</div>
		</section>
	);
}
