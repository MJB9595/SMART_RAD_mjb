"use client";

import type { AuthUser } from "@/lib/types/auth";

export function TopNav({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
	return (
		<header className="topbar">
			<div className="search-box">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9AA3B2" strokeWidth="2">
					<circle cx="11" cy="11" r="7" />
					<path d="M21 21l-4.3-4.3" />
				</svg>
				<input 
					type="text" 
					placeholder="이름, 사번, 부서로 검색" 
					className="bg-transparent outline-none w-full"
				/>
			</div>
			<div className="user-box">
				<span className="notif-dot"></span>
				<div className="user-avatar">{user?.name ? user.name.slice(0, 1) : "U"}</div>
				<div>
					<div className="user-name">{user?.name ?? "사용자"}</div>
					<div className="user-role">{user?.role ?? "권한 없음"}</div>
				</div>
				<button onClick={onLogout} className="ml-4 text-xs font-semibold text-slate-500 hover:text-slate-700">
					로그아웃
				</button>
			</div>
		</header>
	);
}
