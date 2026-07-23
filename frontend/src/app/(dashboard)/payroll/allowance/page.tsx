"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { listAllowances, type Allowance } from "@/lib/api/allowance";

export default function AllowancePage() {
	const [allowances, setAllowances] = useState<Allowance[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		listAllowances()
			.then((data) => active && setAllowances(data))
			.catch(() => active && setAllowances([]))
			.finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, []);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				급여 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">수당 관리</span>
			</nav>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">수당 관리</h1>
					<p className="mt-1 text-sm text-slate-500">급여에 적용되는 수당 항목 및 속성을 관리합니다.</p>
				</div>
				<Button>수당 등록</Button>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
							<th className="p-3 font-medium">수당 ID</th>
							<th className="p-3 font-medium">수당명</th>
							<th className="p-3 font-medium text-center">과세 여부</th>
							<th className="p-3 font-medium text-center">고정 여부</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td colSpan={4} className="p-6 text-center text-slate-400">불러오는 중...</td></tr>
						) : allowances.length === 0 ? (
							<tr><td colSpan={4} className="p-6 text-center text-slate-400">등록된 수당이 없습니다.</td></tr>
						) : (
							allowances.map((a) => (
								<tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3 font-medium text-slate-500">A{String(a.id).padStart(3, "0")}</td>
									<td className="p-3 font-medium text-slate-900">{a.name}</td>
									<td className="p-3 text-center">
										{a.taxable ? (
											<span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">과세</span>
										) : (
											<span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">비과세</span>
										)}
									</td>
									<td className="p-3 text-center">
										{a.fixed ? (
											<span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">고정수당</span>
										) : (
											<span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">변동수당</span>
										)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
