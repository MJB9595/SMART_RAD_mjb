"use client";

import { useEffect, useState } from "react";
import { getAttendanceSummary } from "@/lib/api/attendance";
import { ApiError } from "@/lib/api/client";
import type { AttendanceSummary } from "@/lib/types/attendance";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function AttendanceDashboardPage() {
	const [summary, setSummary] = useState<AttendanceSummary | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getAttendanceSummary(today())
			.then(setSummary)
			.catch((err) => setError(err instanceof ApiError ? err.message : "대시보드를 불러오지 못했습니다."));
	}, []);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				통계 대시보드 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">당일 근태 현황</span>
			</nav>
			<h1 className="mb-6 text-2xl font-bold text-slate-900">당일 근태 현황</h1>

			{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

			<div className="mb-8 grid grid-cols-4 gap-4">
				{[
					{ label: "출근", value: summary?.present ?? 0 },
					{ label: "지각", value: summary?.late ?? 0 },
					{ label: "결근", value: summary?.absent ?? 0 },
					{ label: "연차", value: summary?.annualLeave ?? 0 },
				].map((s) => (
					<div key={s.label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<p className="text-sm font-semibold text-slate-500">{s.label}</p>
						<p className="mt-2 text-3xl font-bold text-slate-900">{s.value}<span className="text-base font-normal text-slate-500 ml-1">명</span></p>
					</div>
				))}
			</div>
		</div>
	);
}
