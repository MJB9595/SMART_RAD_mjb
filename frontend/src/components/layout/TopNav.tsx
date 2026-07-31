"use client";

import { useState, useRef, useEffect } from "react";
import type { AuthUser } from "@/lib/types/auth";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";

export function TopNav({ user, onLogout, onToggleSidebar }: { user: AuthUser; onLogout: () => void; onToggleSidebar?: () => void }) {
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className="topbar">
			<div className="flex items-center text-lg font-bold text-[#E6007E] whitespace-nowrap">
				<button 
					onClick={onToggleSidebar}
					className="lg:hidden mr-3 p-1 text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0"
					title="메뉴 열기"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="3" y1="12" x2="21" y2="12"></line>
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<line x1="3" y1="18" x2="21" y2="18"></line>
					</svg>
				</button>
				<img src="/kbu_logo.png" alt="경복대학교 로고" className="h-8 w-8 object-cover object-left mr-2 flex-shrink-0" />
				<span className="hidden sm:inline">경복대학교</span>
			</div>
			<div className="user-box relative" ref={dropdownRef}>
				<span className="notif-dot"></span>
				<button 
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					className="flex items-center gap-2 hover:bg-slate-50 p-1.5 pr-3 rounded-lg transition-colors cursor-pointer text-left border-none bg-transparent"
				>
					<div className="user-avatar flex-shrink-0">{user?.name ? user.name.slice(0, 1) : "U"}</div>
					<div className="whitespace-nowrap">
						<div className="user-name">{user?.name ?? "사용자"}</div>
						<div className="user-role">{user?.role ?? "권한 없음"}</div>
					</div>
					<svg className={`w-4 h-4 ml-1 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
				</button>
				
				{/* Dropdown Menu */}
				{isDropdownOpen && (
					<div className="absolute top-[110%] right-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
						<button
							onClick={() => {
								setIsDropdownOpen(false);
								setShowPasswordModal(true);
							}}
							className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
							비밀번호 변경
						</button>
						<div className="h-px bg-slate-100 my-1 mx-2"></div>
						<button 
							onClick={() => {
								setIsDropdownOpen(false);
								onLogout();
							}} 
							className="w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
							로그아웃
						</button>
					</div>
				)}
			</div>
			{showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
		</header>
	);
}
