"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { topNavTabs, findActiveTab, isNavItemActive } from "@/lib/nav";
import { useAuth } from "@/lib/auth/AuthContext";
import { hasPermission } from "@/lib/auth/permissions";

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
	const pathname = usePathname();
	const activeTab = findActiveTab(pathname);
	const { user } = useAuth();

	return (
		<aside className={`sidebar ${isOpen ? 'open' : ''}`}>
			<div className="logo-row">
				<div className="logo-badge">
					<svg viewBox="0 0 24 24" fill="none">
						<rect x="3" y="3" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.95" />
						<rect x="13" y="3" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.6" />
						<rect x="3" y="13" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.6" />
						<rect x="13" y="13" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.95" />
					</svg>
				</div>
				<div className="logo-text-wrap flex-1">
					<div className="logo-title">TSM</div>
					<div className="logo-sub">교직원 인사관리 시스템</div>
				</div>
				<button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg bg-slate-50 border border-slate-100">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				</button>
			</div>
			
			<div className="nav-label">HR MODULES</div>
			
			{topNavTabs
				.filter(tab => !tab.requiredPermission || hasPermission(user, tab.requiredPermission))
				.map((tab) => {
				const isTabActive = tab.key === activeTab.key;
				return (
					<div key={tab.key}>
						<Link href={tab.basePath} className={`nav-item ${isTabActive ? "active" : ""}`} onClick={onClose}>
							{tab.label}
						</Link>
						
						{isTabActive && (
							<div className="nav-sub">
								{tab.sections
									.flatMap(section => section.items)
									.filter(item => (!item.requiredPermission || hasPermission(user, item.requiredPermission))
										&& (!item.requiredRoles || (user != null && item.requiredRoles.includes(user.role))))
									.map(item => {
									const isActive = isNavItemActive(pathname, item.href, tab.sections.flatMap(s => s.items).map(i => i.href));
									return (
										<Link key={item.href} href={item.href} className={isActive ? "on" : ""} onClick={onClose}>
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
