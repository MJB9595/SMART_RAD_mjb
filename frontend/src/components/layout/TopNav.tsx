"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { topNavTabs, findActiveTab } from "@/lib/nav";
import type { AuthUser } from "@/lib/types/auth";

export function TopNav({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
	const pathname = usePathname();
	const activeTab = findActiveTab(pathname);

	return (
		<header className="flex h-16 shrink-0 items-center justify-between bg-[#0f1730] px-6 text-white">
			<div className="flex items-center gap-10">
				<div className="flex items-center gap-2 text-base font-bold">
					<span className="h-5 w-1.5 rounded bg-blue-500" />
					인사관리시스템
				</div>
				<nav className="flex h-16 items-center gap-8 text-sm">
					{topNavTabs.map((tab) => {
						const active = tab.key === activeTab.key;
						return (
							<Link
								key={tab.key}
								href={tab.basePath}
								className={`flex h-16 items-center border-b-2 ${
									active
										? "border-blue-500 font-semibold text-white"
										: "border-transparent text-slate-400 hover:text-white"
								}`}
							>
								{tab.label}
							</Link>
						);
					})}
				</nav>
			</div>

			<div className="flex items-center gap-4 text-sm text-slate-300">
				<span>알림</span>
				<div className="flex items-center gap-2">
					<span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
						{user.name.slice(0, 1)}
					</span>
					<span className="text-white">{user.name}</span>
				</div>
				<button onClick={onLogout} className="hover:text-white">
					로그아웃
				</button>
			</div>
		</header>
	);
}
