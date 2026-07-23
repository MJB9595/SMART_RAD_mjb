"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { listLeavePolicies, type LeavePolicy } from "@/lib/api/leaves";
import { listPositions } from "@/lib/api/meta";

export default function LeavePolicyPage() {
	const [policies, setPolicies] = useState<LeavePolicy[]>([]);
	const [posName, setPosName] = useState<Record<number, string>>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		Promise.all([listLeavePolicies(), listPositions()])
			.then(([pols, positions]) => {
				if (!active) return;
				setPolicies(pols);
				setPosName(Object.fromEntries(positions.map((p) => [p.id, p.name])));
			})
			.catch(() => active && setPolicies([]))
			.finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, []);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				휴가 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">휴가유형·정책 관리</span>
			</nav>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">휴가 정책 관리</h1>
					<p className="mt-1 text-sm text-slate-500">직급별 연차 부여 기준 및 이월 한도를 관리합니다.</p>
				</div>
				<Button>새 정책 등록</Button>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
							<th className="p-3 font-medium">적용 직급</th>
							<th className="p-3 font-medium text-right">기본 연차일수</th>
							<th className="p-3 font-medium text-right">최대 이월한도</th>
							<th className="p-3 font-medium text-center">반차 허용</th>
							<th className="p-3 font-medium">비고</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td colSpan={5} className="p-6 text-center text-slate-400">불러오는 중...</td></tr>
						) : policies.length === 0 ? (
							<tr><td colSpan={5} className="p-6 text-center text-slate-400">등록된 휴가 정책이 없습니다.</td></tr>
						) : (
							policies.map((p) => (
								<tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3 font-medium text-slate-900">{posName[p.positionId] ?? `직급#${p.positionId}`}</td>
									<td className="p-3 text-right">{p.annualLeaveDays}일</td>
									<td className="p-3 text-right">{p.maxCarryOverDays}일</td>
									<td className="p-3 text-center">
										{p.halfDayAllowed ? (
											<span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">허용</span>
										) : (
											<span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">불가</span>
										)}
									</td>
									<td className="p-3 text-slate-500">{p.note || "-"}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
