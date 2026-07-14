import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGridSection } from "@/components/landing/FeaturesGridSection";
import { FeatureDetailSection } from "@/components/landing/FeatureDetailSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { ScrollToTopButton } from "@/components/landing/ScrollToTopButton";
import { Clock, Banknote } from "lucide-react";

export default function LandingPage() {
	return (
		<div className="flex min-h-screen flex-col bg-white">
			<LandingHeader />
			<main className="flex-1">
				<HeroSection />
				<FeaturesGridSection />
				
				<div id="attendance" className="scroll-mt-16">
					<FeatureDetailSection
						badgeText="복무관리 / 휴가 관리"
						badgeIcon={<Clock className="h-4 w-4 mr-1.5" />}
						title={"출퇴근부터 연가까지 실시간으로\n관리하세요"}
						features={[
							"교원·행정직·기간제 등 유형별 복무 설정",
							"초과 근무 시간 임박 자동 알림",
							"복무이탈·지각·조퇴 자동 집계 및 통보"
						]}
						mockupType="attendance"
						mockupStyle="floating"
					/>
				</div>
				
				<div id="salary" className="scroll-mt-16">
					<FeatureDetailSection
						badgeText="급여 · 복지"
						badgeIcon={<Banknote className="h-4 w-4 mr-1.5" />}
						title="급여 계산 실수 없이 정확하게"
						description="복무·초과근무·휴가 데이터가 급여에 그대로 반영됩니다. 공무원연금과 4대 보험, 소득세까지 자동 산출해 급여 마감을 빠르게 완료하세요."
						features={[
							"복무 연동 자동 급여 계산",
							"공무원연금 · 4대 보험 · 소득세 자동 산출",
							"급여명세서 자동 발송 및 전자 보관"
						]}
						reverse={true}
						mockupType="salary"
						mockupStyle="floating"
					/>
				</div>
				
				<div id="hr" className="scroll-mt-16">
					<FeatureDetailSection
						badgeText="인사관리"
						title={"조직도부터 인사발령까지,\n모든 교직원 이력을 한 곳에"}
						features={[
							"실시간 반영되는 학교 조직도와 구성원",
							"신규·승진·파견 인사발령 이력 자동 기록",
							"권한별로 열람 범위를 세밀하게 통제"
						]}
						mockupType="hr"
						mockupStyle="floating"
					/>
				</div>
				
				<SecuritySection />
			</main>
			<LandingFooter />
			<ScrollToTopButton />
		</div>
	);
}
