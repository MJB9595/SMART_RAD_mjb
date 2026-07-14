import { BookOpen, Calendar, Users, ShieldCheck } from "lucide-react";

export function FeaturesGridSection() {
	return (
		<section className="py-24 bg-white">
			<div className="mx-auto max-w-[1600px] px-8 md:px-16 lg:px-24">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<div className="badge-primary mb-6">
						WHY SCHOOLHR
					</div>
					<h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
						교무담당자가 매일 마주하는 문제를<br />
						제대로 풀어냅니다
					</h2>
					<p className="text-lg text-slate-600">
						복잡, 비효율적인 업무, 이중입력, 성과 평가까지 — 학교 인사 업무의 부담을 학교HR이 제대로 줄여드립니다.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Card 1 */}
					<div className="card-base">
						<div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
							<BookOpen className="h-6 w-6" />
						</div>
						<h3 className="text-lg font-bold text-slate-900 mb-3">
							교육청 복무규정 자동 적용
						</h3>
						<p className="text-sm text-slate-600 mb-6 leading-relaxed">
							매년 바뀌는 교육부 복무규정과 지침을 배경으로 자동화합니다. 더욱 쉬운 시스템이 자동으로 업데이트됩니다.
						</p>
						<div className="badge-success">
							복무규정 자동화
						</div>
					</div>

					{/* Card 2 */}
					<div className="card-base">
						<div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
							<Calendar className="h-6 w-6" />
						</div>
						<h3 className="text-lg font-bold text-slate-900 mb-3">
							다양한 교원 휴가 관리
						</h3>
						<p className="text-sm text-slate-600 mb-6 leading-relaxed">
							연가, 병가, 출산·특별휴가 등 교원 휴가를 관리하고 승인 및 내역을 제공하고 신청·승인을 간편하게 관리합니다.
						</p>
						<div className="badge-success">
							연가 자동 계산
						</div>
					</div>

					{/* Card 3 */}
					<div className="card-base">
						<div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
							<Users className="h-6 w-6" />
						</div>
						<h3 className="text-lg font-bold text-slate-900 mb-3">
							인사발령 이력 자동 기록
						</h3>
						<p className="text-sm text-slate-600 mb-6 leading-relaxed">
							채용, 승진, 발령, 퇴직 등 모든 인사발령을 자동으로 파악하고 교직원의 상세 이력을 제공합니다.
						</p>
						<div className="badge-success">
							발령 이력 관리
						</div>
					</div>

					{/* Card 4 */}
					<div className="card-base">
						<div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
							<ShieldCheck className="h-6 w-6" />
						</div>
						<h3 className="text-lg font-bold text-slate-900 mb-3">
							철저한 개인 정보 보안
						</h3>
						<p className="text-sm text-slate-600 mb-6 leading-relaxed">
							ISMS 인증 보안 체계로 민감한 교원 인사정보를 안전하게 보호합니다. 인가된 사용자만 접근할 수 있습니다.
						</p>
						<div className="badge-success">
							보안 체계 인증
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
