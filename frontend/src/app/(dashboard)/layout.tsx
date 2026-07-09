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
		<div className="flex flex-1 flex-col">
			<TopNav
				user={user}
				onLogout={() => {
					logout();
					router.replace("/login");
				}}
			/>
			<div className="flex flex-1">
				<Sidebar />
				<main className="flex-1 bg-white p-6 text-slate-900">{children}</main>
			</div>
		</div>
	);
}
