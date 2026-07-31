"use client";

import { useEffect, useState } from "react";
import { listLeaveBalances } from "@/lib/api/leaves";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Input } from "@/components/ui";
import type { LeaveBalance } from "@/lib/types/leave";

export default function LeaveBalancePage() {
	const [year, setYear] = useState(new Date().getFullYear());
	const [items, setItems] = useState<LeaveBalance[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	function load(y: number) {
		setLoading(true);
		setError(null);
		listLeaveBalances(y)
			.then(setItems)
			.catch((err) => setError(err instanceof ApiError ? err.message : "잔여일수를 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load(year);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				근태·휴가 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">잔여일수 현황</span>
			</nav>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">잔여일수 현황</h1>
				<p className="mt-1 text-sm text-slate-500">교직원별 연차 부여·사용·잔여 현황을 조회합니다.</p>
			</div>

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
					<Field label="기준연도">
						<Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full sm:w-28" />
					</Field>
					<Button variant="primary" onClick={() => load(year)}>조회</Button>
				</div>
			</div>

			{loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && !error && (
				<>
					<div className="overflow-x-auto">
					<table className="hidden w-full border-collapse text-sm lg:table">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
								<th className="p-3 font-medium">사번</th>
								<th className="p-3 font-medium">성명</th>
								<th className="p-3 font-medium">소속</th>
								<th className="p-3 font-medium">부여일수</th>
								<th className="p-3 font-medium">사용일수</th>
								<th className="p-3 font-medium">잔여일수</th>
								<th className="p-3 font-medium">사용률</th>
							</tr>
						</thead>
						<tbody>
							{items.map((b) => {
								const rate = b.totalGranted > 0 ? Math.round((b.usedDays / b.totalGranted) * 100) : 0;
								return (
									<tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
										<td className="p-3">{b.employeeNumber}</td>
										<td className="p-3">{b.employeeName}</td>
										<td className="p-3">{b.departmentName}</td>
										<td className="p-3">{b.totalGranted}일</td>
										<td className="p-3">{b.usedDays}일</td>
										<td className="p-3 font-medium text-blue-600">{b.remaining}일</td>
										<td className="p-3">{rate}%</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					</div>

					{/* 모바일: 표 대신 카드 — 7개 열이 좁은 화면에 들어가지 않는다 */}
					<div className="flex flex-col gap-3 lg:hidden">
						{items.map((b) => {
							const rate = b.totalGranted > 0 ? Math.round((b.usedDays / b.totalGranted) * 100) : 0;
							return (
								<div key={b.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
									<div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
										<div>
											<div className="text-sm font-bold text-slate-900">{b.employeeName}</div>
											<div className="text-xs text-slate-400">{b.employeeNumber} · {b.departmentName}</div>
										</div>
										<span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
											잔여 {b.remaining}일
										</span>
									</div>
									<div className="mt-3 grid grid-cols-3 gap-2 text-center">
										<div>
											<div className="text-[11px] text-slate-400">부여</div>
											<div className="text-sm font-bold text-slate-900">{b.totalGranted}일</div>
										</div>
										<div>
											<div className="text-[11px] text-slate-400">사용</div>
											<div className="text-sm font-bold text-slate-900">{b.usedDays}일</div>
										</div>
										<div>
											<div className="text-[11px] text-slate-400">사용률</div>
											<div className="text-sm font-bold text-slate-900">{rate}%</div>
										</div>
									</div>
								</div>
							);
						})}
						{items.length === 0 && (
							<p className="py-8 text-center text-sm text-slate-400">조회된 휴가 잔여 내역이 없습니다.</p>
						)}
					</div>

					<div className="mt-4 text-sm text-slate-500">총 {items.length}건</div>
				</>
			)}
		</div>
	);
}
