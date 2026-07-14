"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { topNavTabs, findActiveTab, isNavItemActive } from "@/lib/nav";

export function Sidebar() {
	const pathname = usePathname();
	const activeTab = findActiveTab(pathname);

	return (
		<aside className="sidebar">
			<div className="logo-row">
				<div className="logo-badge">
					<svg viewBox="0 0 24 24" fill="none">
						<rect x="3" y="3" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.95" />
						<rect x="13" y="3" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.6" />
						<rect x="3" y="13" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.6" />
						<rect x="13" y="13" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.95" />
					</svg>
				</div>
				<div className="logo-text-wrap">
					<div className="logo-title">TSM</div>
					<div className="logo-sub">교직원 인사관리 시스템</div>
				</div>
			</div>
			
			<div className="nav-label">HR MODULES</div>
			
			{topNavTabs.map((tab) => {
				const isTabActive = tab.key === activeTab.key;
				return (
					<div key={tab.key}>
						<Link href={tab.basePath} className={`nav-item ${isTabActive ? "active" : ""}`}>
							{tab.label}
						</Link>
						
						{isTabActive && (
							<div className="nav-sub">
								{tab.sections.flatMap(section => section.items).map(item => {
									const isActive = isNavItemActive(pathname, item.href, tab.sections.flatMap(s => s.items).map(i => i.href));
									return (
										<Link key={item.href} href={item.href} className={isActive ? "on" : ""}>
											<span className="dot"></span>{item.label}
										</Link>
									);
								})}
							</div>
						)}
					</div>
				);
			})}
		</aside>
	);
}
