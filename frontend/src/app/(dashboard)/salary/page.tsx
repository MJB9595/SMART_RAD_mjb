"use client";

import { useEffect, useMemo, useState } from "react";
import { listSalaries } from "@/lib/api/salaries";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui";
import type { SalaryBasic } from "@/lib/types/salary";

function won(n: number) {
	return n.toLocaleString() + "원";
}

function toCsv(rows: SalaryBasic[]): string {
	const header = ["사번", "성명", "소속", "직급", "기본급", "식대", "교통비", "직급수당", "수당합계", "총지급액", "은행", "계좌번호"];
	const lines = rows.map((s) =>
		[
			s.employeeNumber, s.employeeName, s.departmentName, s.positionName,
			s.basePay, s.mealAllowance, s.transportAllowance, s.positionAllowance,
			s.totalAllowance, s.totalPay, s.bankName ?? "", s.accountNumber ?? "",
		].join(","),
	);
	return "﻿" + [header.join(","), ...lines].join("\n");
}

export default function SalaryPage() {
	const [items, setItems] = useState<SalaryBasic[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listSalaries()
			.then(setItems)
			.catch((err) => setError(err instanceof ApiError ? err.message : "급여 정보를 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	const totals = useMemo(
		() => items.reduce((acc, s) => ({ base: acc.base + s.basePay, total: acc.total + s.totalPay }), { base: 0, total: 0 }),
		[items],
	);

	function download() {
		const blob = new Blob([toCsv(items)], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `기초급여_정산_${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				급여 연계 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">기초 급여 조회</span>
			</nav>

			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">기초 급여 조회</h1>
					<p className="mt-1 text-sm text-slate-500">교직원별 기본급 및 수당 기준 정보를 조회합니다.</p>
				</div>
				<Button variant="outline" onClick={download}>엑셀(CSV) 다운로드</Button>
			</div>

			{loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && !error && (
				<>
					<div className="mb-4 grid grid-cols-3 gap-4">
						<div className="rounded-lg border border-slate-200 p-4">
							<p className="text-sm text-slate-500">등록 인원</p>
							<p className="mt-1 text-2xl font-bold text-slate-900">{items.length}명</p>
						</div>
						<div className="rounded-lg border border-slate-200 p-4">
							<p className="text-sm text-slate-500">기본급 합계</p>
							<p className="mt-1 text-2xl font-bold text-slate-900">{won(totals.base)}</p>
						</div>
						<div className="rounded-lg border border-slate-200 p-4">
							<p className="text-sm text-slate-500">총 지급액</p>
							<p className="mt-1 text-2xl font-bold text-blue-600">{won(totals.total)}</p>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-sm">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
									<th className="p-3 font-medium">사번</th>
									<th className="p-3 font-medium">성명</th>
									<th className="p-3 font-medium">소속</th>
									<th className="p-3 font-medium">직급</th>
									<th className="p-3 font-medium">기본급</th>
									<th className="p-3 font-medium">수당합계</th>
									<th className="p-3 font-medium">총지급액</th>
									<th className="p-3 font-medium">계좌</th>
								</tr>
							</thead>
							<tbody>
								{items.map((s) => (
									<tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
										<td className="p-3">{s.employeeNumber}</td>
										<td className="p-3">{s.employeeName}</td>
										<td className="p-3">{s.departmentName}</td>
										<td className="p-3">{s.positionName}</td>
										<td className="p-3">{won(s.basePay)}</td>
										<td className="p-3">{won(s.totalAllowance)}</td>
										<td className="p-3 font-medium">{won(s.totalPay)}</td>
										<td className="p-3">{s.bankName ? `${s.bankName} ${s.accountNumber}` : "-"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="mt-4 text-sm text-slate-500">총 {items.length}건</div>
				</>
			)}
		</div>
	);
}
