"use client";

import { useState } from "react";
import type { AuthUser } from "@/lib/types/auth";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";

export function TopNav({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
	const [showPasswordModal, setShowPasswordModal] = useState(false);

	return (
		<header className="topbar">
			<div className="flex items-center text-lg font-bold text-[#E6007E]">
				<img src="/kbu_logo.png" alt="경복대학교 로고" className="h-8 w-8 object-cover object-left mr-2" />
				경복대학교
			</div>
			<div className="user-box">
				<span className="notif-dot"></span>
				<div className="user-avatar">{user?.name ? user.name.slice(0, 1) : "U"}</div>
				<div>
					<div className="user-name">{user?.name ?? "사용자"}</div>
					<div className="user-role">{user?.role ?? "권한 없음"}</div>
				</div>
				<button
					onClick={() => setShowPasswordModal(true)}
					className="ml-4 text-xs font-semibold text-slate-500 hover:text-slate-700"
				>
					비밀번호 변경
				</button>
				<button onClick={onLogout} className="ml-3 text-xs font-semibold text-slate-500 hover:text-slate-700">
					로그아웃
				</button>
			</div>
			{showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
		</header>
	);
}
