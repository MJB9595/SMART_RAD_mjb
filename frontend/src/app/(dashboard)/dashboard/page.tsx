"use client";

import { useEffect, useMemo, useState } from "react";
import { searchEmployees } from "@/lib/api/employees";
import { listDepartments } from "@/lib/api/departments";
import { getAttendanceSummary } from "@/lib/api/attendance";
import { ApiError } from "@/lib/api/client";
import type { Employee } from "@/lib/types/employee";
import type { Department } from "@/lib/types/department";
import type { AttendanceSummary } from "@/lib/types/attendance";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function DashboardPage() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [summary, setSummary] = useState<AttendanceSummary | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		Promise.all([searchEmployees({ size: 200 }), listDepartments(), getAttendanceSummary(today())])
			.then(([page, depts, sum]) => {
				setEmployees(page.content);
				setDepartments(depts);
				setSummary(sum);
			})
			.catch((err) => setError(err instanceof ApiError ? err.message : "대시보드를 불러오지 못했습니다."));
	}, []);

	const headcountByDept = useMemo(() => {
		const map = new Map<number, number>();
		for (const e of employees) map.set(e.departmentId, (map.get(e.departmentId) ?? 0) + 1);
		return map;
	}, [employees]);

	const leafDepartments = departments.filter((d) => d.headcount > 0);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				통계 대시보드 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">현황 대시보드</span>
			</nav>
			<h1 className="mb-6 text-2xl font-bold text-slate-900">현황 대시보드</h1>

			{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

			{/* 당일 근태 현황 */}
			<h2 className="mb-3 text-sm font-semibold text-slate-700">당일 근태 현황 ({today()})</h2>
			<div className="mb-8 grid grid-cols-4 gap-4">
				{[
					{ label: "출근", value: summary?.present ?? 0 },
					{ label: "지각", value: summary?.late ?? 0 },
					{ label: "결근", value: summary?.absent ?? 0 },
					{ label: "연차", value: summary?.annualLeave ?? 0 },
				].map((s) => (
					<div key={s.label} className="rounded-lg border border-slate-200 p-4">
						<p className="text-sm text-slate-500">{s.label}</p>
						<p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
					</div>
				))}
			</div>

			{/* 부서별 정원 현황 */}
			<h2 className="mb-3 text-sm font-semibold text-slate-700">부서별 정원 현황</h2>
			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
						<th className="p-3 font-medium">부서</th>
						<th className="p-3 font-medium">정원</th>
						<th className="p-3 font-medium">현원</th>
						<th className="p-3 font-medium">충원율</th>
					</tr>
				</thead>
				<tbody>
					{leafDepartments.map((d) => {
						const actual = headcountByDept.get(d.id) ?? 0;
						const rate = d.headcount > 0 ? Math.round((actual / d.headcount) * 100) : 0;
						return (
							<tr key={d.id} className="border-b border-slate-100">
								<td className="p-3">{d.name}</td>
								<td className="p-3">{d.headcount}</td>
								<td className="p-3">{actual}</td>
								<td className="p-3">
									<span className={rate >= 100 ? "text-blue-600" : "text-slate-900"}>{rate}%</span>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
