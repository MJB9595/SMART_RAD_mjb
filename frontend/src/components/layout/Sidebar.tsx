"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { findActiveTab } from "@/lib/nav";

export function Sidebar() {
	const pathname = usePathname();
	const activeTab = findActiveTab(pathname);

	return (
		<aside className="w-60 shrink-0 overflow-y-auto bg-[#0f1730] px-4 py-6 text-sm">
			{activeTab.sections.map((section) => (
				<div key={section.label} className="mb-6">
					<p className="mb-2 px-3 text-sm font-semibold text-white">{section.label}</p>
					<ul className="space-y-1">
						{section.items.map((item) => {
							const active = pathname.startsWith(item.href);
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										className={`block rounded px-3 py-2 ${
											active
												? "bg-blue-500/20 font-medium text-white"
												: "text-slate-400 hover:text-white"
										}`}
									>
										{item.label}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			))}
		</aside>
	);
}
