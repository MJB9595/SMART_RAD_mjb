"use client";

import { Button } from "@/components/ui";

const MOCK_POLICIES = [
	{ id: 1, position: "정교수", annualDays: 25, carryOver: 5, halfDay: true, note: "연구년 휴가 별도 산정" },
	{ id: 2, position: "부교수", annualDays: 22, carryOver: 5, halfDay: true, note: "" },
	{ id: 3, position: "조교수", annualDays: 20, carryOver: 5, halfDay: true, note: "" },
	{ id: 4, position: "일반직(정규)", annualDays: 15, carryOver: 3, halfDay: true, note: "근속 2년마다 1일 추가" },
];

export default function LeavePolicyPage() {
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
						{MOCK_POLICIES.map((p) => (
							<tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
								<td className="p-3 font-medium text-slate-900">{p.position}</td>
								<td className="p-3 text-right">{p.annualDays}일</td>
								<td className="p-3 text-right">{p.carryOver}일</td>
								<td className="p-3 text-center">
									{p.halfDay ? (
										<span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">허용</span>
									) : (
										<span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">불가</span>
									)}
								</td>
								<td className="p-3 text-slate-500">{p.note || "-"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
