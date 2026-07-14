"use client";

import { useEffect, useMemo, useState } from "react";
import { listSalaries } from "@/lib/api/salaries";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Input } from "@/components/ui";
import type { SalaryBasic } from "@/lib/types/salary";

function won(n: number) {
	return n.toLocaleString() + "원";
}

function toCsv(rows: SalaryBasic[], period: string): string {
	const header = ["정산월", "사번", "성명", "소속", "직급", "기본급", "수당합계", "총지급액", "은행", "계좌번호", "예금주"];
	const lines = rows.map((s) =>
		[
			period, s.employeeNumber, s.employeeName, s.departmentName, s.positionName,
			s.basePay, s.totalAllowance, s.totalPay, s.bankName ?? "", s.accountNumber ?? "", s.accountHolder ?? "",
		].join(","),
	);
	return "﻿" + [header.join(","), ...lines].join("\n");
}

export default function SettlementPage() {
	const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
	const [items, setItems] = useState<SalaryBasic[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		listSalaries().then(setItems).catch((err) => setError(err instanceof ApiError ? err.message : "급여 정보를 불러오지 못했습니다."));
	}, []);

	const total = useMemo(() => items.reduce((a, s) => a + s.totalPay, 0), [items]);

	function download() {
		const blob = new Blob([toCsv(items, period)], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `급여정산_${period}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				급여 연계 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">정산용 엑셀 다운로드</span>
			</nav>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">정산용 엑셀 다운로드</h1>
				<p className="mt-1 text-sm text-slate-500">지정한 정산월 기준으로 급여 정산 데이터를 CSV로 내려받습니다.</p>
			</div>

			{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

			<div className="rounded-lg border border-slate-200 p-6">
				<div className="flex items-end gap-4">
					<Field label="정산월">
						<Input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} />
					</Field>
					<Button variant="primary" onClick={download}>정산 엑셀 다운로드</Button>
				</div>
				<p className="mt-4 text-sm text-slate-500">
					대상 {items.length}명 · 총 지급액 <span className="font-medium text-slate-900">{won(total)}</span>
				</p>
			</div>
		</div>
	);
}
