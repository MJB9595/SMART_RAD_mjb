"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { user, loading, logout } = useAuth();
	const router = useRouter();

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
			<Sidebar />
			<div className="main">
				<TopNav
					user={user}
					onLogout={() => {
						logout();
						router.replace("/login");
					}}
				/>
				<div className="content">
					{children}
				</div>
			</div>
		</div>
	);
}
