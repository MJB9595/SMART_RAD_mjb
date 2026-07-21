"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function LandingHeader() {
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			
			// 최상단이거나 위로 스크롤할 때 보여줌
			if (currentScrollY < lastScrollY || currentScrollY <= 50) {
				setIsVisible(true);
			} 
			// 아래로 스크롤할 때 숨김
			else if (currentScrollY > lastScrollY && currentScrollY > 50) {
				setIsVisible(false);
			}
			
			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	return (
		<>
			{/* fixed 헤더로 인한 레이아웃 시프트 방지용 자리 차지 div */}
			<div className="h-16 w-full shrink-0" />
			<header 
				className={`fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-8 md:px-16 lg:px-24 transition-transform duration-300 ${
					isVisible ? "translate-y-0" : "-translate-y-full"
				}`}
			>
			<button 
				type="button"
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				className="flex items-center gap-3 text-left focus:outline-none"
			>
				{/* Empty Icon Placeholder */}
				<div className="h-10 w-10 rounded-xl bg-slate-900 shadow-sm flex-shrink-0" />
				{/* Site Title */}
				<div className="flex flex-col justify-center -space-y-1">
					<span className="text-2xl font-extrabold tracking-wider text-slate-900 leading-none">TSM</span>
					<div className="relative">
						<span className="text-[10px] font-semibold text-slate-400 block whitespace-nowrap">Teacher System Manage</span>
						<div className="absolute -bottom-0.5 left-0 h-0.5 w-3/4 bg-blue-500 rounded-full" />
					</div>
				</div>
			</button>
			
			<nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
				<Link href="#attendance" className="hover:text-blue-600">복무·휴가</Link>
				<Link href="#salary" className="hover:text-blue-600">급여·복지</Link>
				<Link href="#hr" className="hover:text-blue-600">인사관리</Link>
				<Link href="#security" className="hover:text-blue-600">보안</Link>
			</nav>

			<div className="flex items-center">
				<Link 
					href="/login" 
					className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				>
					로그인
				</Link>
			</div>
		</header>
		</>
	);
}
