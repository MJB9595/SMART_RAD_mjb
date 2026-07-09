import Link from "next/link";

export function LandingHeader() {
	return (
		<header className="flex items-center justify-between border-b px-6 py-4">
			<span className="font-semibold">TP-HR</span>
			<nav className="flex items-center gap-4 text-sm">
				<Link href="/login">로그인</Link>
			</nav>
		</header>
	);
}
