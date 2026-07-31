"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { UiScale } from "@/components/UiScale";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { user, loading, logout } = useAuth();
	const router = useRouter();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		if (!loading && !user) {
			router.replace("/login");
		}
	}, [user, loading, router]);

	if (loading || !user) {
		return null;
	}

	return (
		<div className="app">
			<UiScale />
			<div className={`sidebar-overlay ${isSidebarOpen ? 'block' : 'hidden'} lg:hidden`} onClick={() => setIsSidebarOpen(false)}></div>
			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
			<div className="main">
				<TopNav
					user={user}
					onLogout={() => {
						logout();
						router.replace("/login");
					}}
					onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
				/>
				<div className="content">
					{children}
				</div>
			</div>
		</div>
	);
}
