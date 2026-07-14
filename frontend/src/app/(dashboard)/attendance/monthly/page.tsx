"use client";

import { useState } from "react";
import { Field, Select, Button } from "@/components/ui";

const MOCK_DATA = [
	{ id: 1, name: "김교수", empNo: "FAC001", dept: "컴퓨터공학과", totalDays: 22, present: 20, late: 1, absent: 1, leave: 0 },
	{ id: 2, name: "이직원", empNo: "STA001", dept: "교무처", totalDays: 22, present: 22, late: 0, absent: 0, leave: 0 },
];

export default function MonthlyAttendancePage() {
	const [year, setYear] = useState("2026");
	const [month, setMonth] = useState("07");

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				근태 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">월 근태 현황</span>
			</nav>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">월 근태 현황</h1>
					<p className="mt-1 text-sm text-slate-500">부서별/직원별 월간 근태 통계를 조회합니다.</p>
				</div>
				<Button variant="outline">엑셀 다운로드</Button>
			</div>

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex flex-wrap items-end gap-4">
					<Field label="연도">
						<Select value={year} onChange={(e) => setYear(e.target.value)}>
							<option value="2026">2026년</option>
							<option value="2025">2025년</option>
						</Select>
					</Field>
					<Field label="월">
						<Select value={month} onChange={(e) => setMonth(e.target.value)}>
							{Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(m => (
								<option key={m} value={m}>{m}월</option>
							))}
						</Select>
					</Field>
				</div>
			</div>

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
						<th className="p-3 font-medium">소속</th>
						<th className="p-3 font-medium">사번</th>
						<th className="p-3 font-medium">성명</th>
						<th className="p-3 font-medium">근무일수</th>
						<th className="p-3 font-medium">정상출근</th>
						<th className="p-3 font-medium">지각</th>
						<th className="p-3 font-medium">결근</th>
						<th className="p-3 font-medium">휴가</th>
					</tr>
				</thead>
				<tbody>
					{MOCK_DATA.map((d) => (
						<tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
							<td className="p-3">{d.dept}</td>
							<td className="p-3">{d.empNo}</td>
							<td className="p-3">{d.name}</td>
							<td className="p-3">{d.totalDays}일</td>
							<td className="p-3 text-blue-600 font-medium">{d.present}일</td>
							<td className="p-3 text-orange-600">{d.late}일</td>
							<td className="p-3 text-red-600">{d.absent}일</td>
							<td className="p-3 text-slate-600">{d.leave}일</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
