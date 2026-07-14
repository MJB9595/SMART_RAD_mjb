import { ShieldCheck, Lock, KeyRound, ScrollText } from "lucide-react";

export function SecuritySection() {
	return (
		<section id="security" className="bg-slate-900 py-24 pb-32">
			<div className="mx-auto max-w-[1600px] px-8 md:px-16 lg:px-24">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<div className="badge-dark mb-6">
						Security & Compliance
					</div>
					<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
						가장 민감한 교원 인사 데이터를<br />
						가장 안전하게 지킵니다
					</h2>
					<p className="text-lg text-slate-400">
						국제 표준 수준의 보안 체계와 인증으로, 교직원의 개인정보와 학교의 인사 데이터를 안전하게 보호합니다.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Card 1 */}
					<div className="card-dark">
						<div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
							<ShieldCheck className="h-5 w-5" />
						</div>
						<h3 className="text-base font-bold text-white mb-2">
							ISMS 인증
						</h3>
						<p className="text-sm text-slate-400 leading-relaxed">
							정보보호 관리체계 인증을 획득하여 최고 수준의 보안을 증명합니다.
						</p>
					</div>

					{/* Card 2 */}
					<div className="card-dark">
						<div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
							<Lock className="h-5 w-5" />
						</div>
						<h3 className="text-base font-bold text-white mb-2">
							데이터 암호화
						</h3>
						<p className="text-sm text-slate-400 leading-relaxed">
							전송, 저장 구간의 모든 데이터를 철저하게 암호화하여 외부 유출 위험을 차단합니다.
						</p>
					</div>

					{/* Card 3 */}
					<div className="card-dark">
						<div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
							<KeyRound className="h-5 w-5" />
						</div>
						<h3 className="text-base font-bold text-white mb-2">
							세부적인 권한
						</h3>
						<p className="text-sm text-slate-400 leading-relaxed">
							역할별 접근 권한을 엄격하게 나누어 정보 열람 및 수정을 통제합니다.
						</p>
					</div>

					{/* Card 4 */}
					<div className="card-dark">
						<div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
							<ScrollText className="h-5 w-5" />
						</div>
						<h3 className="text-base font-bold text-white mb-2">
							접근 감사 로그
						</h3>
						<p className="text-sm text-slate-400 leading-relaxed">
							누가, 언제, 어디서 증명했는지 모든 이력을 남겨 추적합니다.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
