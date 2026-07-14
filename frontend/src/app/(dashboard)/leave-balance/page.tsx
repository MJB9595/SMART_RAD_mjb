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
				<div className="flex items-end gap-4">
					<Field label="기준연도">
						<Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-28" />
					</Field>
					<Button variant="primary" onClick={() => load(year)}>조회</Button>
				</div>
			</div>

			{loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && !error && (
				<>
					<table className="w-full border-collapse text-sm">
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
					<div className="mt-4 text-sm text-slate-500">총 {items.length}건</div>
				</>
			)}
		</div>
	);
}
