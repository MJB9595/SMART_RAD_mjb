import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingSection } from "@/components/landing/LandingSection";

export default function LandingPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<LandingHeader />
			<main className="flex-1">
				<LandingSection label="섹션 1" />
				<LandingSection label="섹션 2" />
				<LandingSection label="섹션 3" />
			</main>
			<LandingFooter />
		</div>
	);
}
