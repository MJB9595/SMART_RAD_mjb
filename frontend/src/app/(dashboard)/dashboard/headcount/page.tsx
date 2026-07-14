"use client";

import { useEffect, useMemo, useState } from "react";
import { searchEmployees } from "@/lib/api/employees";
import { listDepartments } from "@/lib/api/departments";
import { ApiError } from "@/lib/api/client";
import type { Employee } from "@/lib/types/employee";
import type { Department } from "@/lib/types/department";

export default function HeadcountPage() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		Promise.all([searchEmployees({ size: 200 }), listDepartments()])
			.then(([page, depts]) => {
				setEmployees(page.content);
				setDepartments(depts);
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
				<span className="font-medium text-slate-900">부서별 정원 현황</span>
			</nav>
			<h1 className="mb-6 text-2xl font-bold text-slate-900">부서별 정원 현황</h1>

			{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

			<div className="rounded-lg border border-slate-200 bg-white">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
							<th className="p-3 font-medium">부서</th>
							<th className="p-3 font-medium text-right">정원</th>
							<th className="p-3 font-medium text-right">현원</th>
							<th className="p-3 font-medium text-center">충원율</th>
						</tr>
					</thead>
					<tbody>
						{leafDepartments.map((d) => {
							const actual = headcountByDept.get(d.id) ?? 0;
							const rate = d.headcount > 0 ? Math.round((actual / d.headcount) * 100) : 0;
							return (
								<tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3 font-medium text-slate-900">{d.name}</td>
									<td className="p-3 text-right">{d.headcount}명</td>
									<td className="p-3 text-right">{actual}명</td>
									<td className="p-3 text-center">
										<span className={rate >= 100 ? "text-blue-600 font-semibold" : "text-slate-900"}>{rate}%</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
