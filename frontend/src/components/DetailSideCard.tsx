"use client";

import type { ReactNode } from "react";

/**
 * 월 근태·월 휴가 화면 우측의 상세 카드.
 *
 * <p>같은 자리에 같은 역할로 붙는 카드인데 두 화면이 서로 다르게 생겨 있었다(아바타 모양,
 * 헤더 배치, 통계 블록 스타일). 껍데기와 머리말·통계 묶음을 여기로 모아 두 화면이 같은
 * 모양을 쓰게 한다. 내용(본문)은 화면마다 다르므로 children 으로 받는다.
 */
export function DetailSideCard({
	eyebrow,
	name,
	subtitle,
	badge,
	stats,
	children,
	footer,
}: {
	/** 카드 최상단 라벨 (예: "근태 상세", "휴가 관리 내역") */
	eyebrow: string;
	name: string;
	subtitle?: string | null;
	/** 이름 옆 강조 뱃지 (예: 본인) */
	badge?: ReactNode;
	/** 3칸 요약. 비우면 표시하지 않는다. */
	stats?: { label: string; value: ReactNode; tone?: "default" | "warn" | "primary" }[];
	children?: ReactNode;
	footer?: ReactNode;
}) {
	const toneClass = (tone?: string) =>
		tone === "warn" ? "text-amber-600" : tone === "primary" ? "text-indigo-700" : "text-slate-900";

	return (
		<div className="w-[380px] shrink-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-8 flex flex-col relative overflow-hidden animate-in slide-in-from-right-4 duration-300 h-full">
			<div className="text-sm font-bold text-indigo-900 mb-6 tracking-tight">{eyebrow}</div>

			<div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 shrink-0">
				<div className="w-14 h-14 rounded-2xl bg-[#1e3a8a] text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-200/50 shrink-0">
					{name?.slice(0, 1) ?? "-"}
				</div>
				<div className="min-w-0">
					<div className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
						<span className="truncate">{name}</span>
						{badge}
					</div>
					{subtitle && <div className="text-slate-400 font-medium text-sm mt-0.5 truncate">{subtitle}</div>}
				</div>
			</div>

			{stats && stats.length > 0 && (
				<div className="grid grid-cols-3 gap-2 mb-6 shrink-0">
					{stats.map((s) => (
						<div key={s.label} className="bg-[#f8f9fa] rounded-xl p-3 flex flex-col items-center justify-center">
							<div className="text-[12px] font-medium text-slate-400 mb-1">{s.label}</div>
							<div className={`text-lg font-bold ${toneClass(s.tone)}`}>{s.value}</div>
						</div>
					))}
				</div>
			)}

			<div className="flex-1 overflow-y-auto min-h-0 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
				{children}
			</div>

			{footer && <div className="mt-auto pt-4 shrink-0">{footer}</div>}
		</div>
	);
}
