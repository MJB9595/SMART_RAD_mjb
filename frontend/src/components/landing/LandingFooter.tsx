import Link from "next/link";

export function LandingFooter() {
	return (
		<footer className="border-t border-slate-200 bg-slate-50 px-8 py-8 md:px-16 lg:px-24">
			<div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 md:flex-row">
				<div className="flex items-center gap-6 text-sm font-medium text-slate-600">
					<Link href="/terms" className="hover:text-slate-900">이용약관</Link>
					<Link href="/privacy" className="hover:text-slate-900">개인정보처리방침</Link>
					<Link href="/support" className="hover:text-slate-900">고객센터</Link>
				</div>
				<div className="text-sm text-slate-400">
					© 2026 SchoolHR. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
