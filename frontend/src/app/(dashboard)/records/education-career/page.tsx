"use client";

import { useEffect, useState } from "react";
import { searchEmployees } from "@/lib/api/employees";
import { getCareers, getEducations } from "@/lib/api/records";
import { ApiError } from "@/lib/api/client";
import { Field, Select } from "@/components/ui";
import type { Employee, Career, Education } from "@/lib/types/employee";

export default function EducationCareerPage() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [selected, setSelected] = useState<string>("");
	const [educations, setEducations] = useState<Education[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		searchEmployees({ size: 200 })
			.then((page) => {
				setEmployees(page.content);
				if (page.content.length > 0) setSelected(String(page.content[0].id));
			})
			.catch((err) => setError(err instanceof ApiError ? err.message : "교직원을 불러오지 못했습니다."));
	}, []);

	useEffect(() => {
		if (!selected) return;
		const id = Number(selected);
		getEducations(id).then(setEducations).catch(() => setEducations([]));
		getCareers(id).then(setCareers).catch(() => setCareers([]));
	}, [selected]);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				인사기록 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">학력·경력 관리</span>
			</nav>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">학력·경력 관리</h1>
				<p className="mt-1 text-sm text-slate-500">교직원별 학력·경력 사항을 조회하고 관리합니다.</p>
			</div>

			{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<Field label="교직원 선택">
					<Select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-64">
						{employees.map((emp) => (
							<option key={emp.id} value={emp.id}>
								{emp.employeeNumber} · {emp.name} ({emp.departmentName})
							</option>
						))}
					</Select>
				</Field>
			</div>

			<h2 className="mb-3 text-sm font-semibold text-slate-700">학력</h2>
			<table className="mb-8 w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
						<th className="p-3 font-medium">학교명</th>
						<th className="p-3 font-medium">전공</th>
						<th className="p-3 font-medium">학위</th>
						<th className="p-3 font-medium">졸업일</th>
						<th className="p-3 font-medium">상태</th>
					</tr>
				</thead>
				<tbody>
					{educations.length === 0 ? (
						<tr><td colSpan={5} className="p-6 text-center text-slate-400">등록된 학력이 없습니다.</td></tr>
					) : (
						educations.map((e) => (
							<tr key={e.id} className="border-b border-slate-100">
								<td className="p-3">{e.schoolName}</td>
								<td className="p-3">{e.major ?? "-"}</td>
								<td className="p-3">{e.degree ?? "-"}</td>
								<td className="p-3">{e.graduationDate ?? "-"}</td>
								<td className="p-3">{e.status ?? "-"}</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			<h2 className="mb-3 text-sm font-semibold text-slate-700">경력</h2>
			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
						<th className="p-3 font-medium">기관/회사</th>
						<th className="p-3 font-medium">부서</th>
						<th className="p-3 font-medium">직위</th>
						<th className="p-3 font-medium">시작일</th>
						<th className="p-3 font-medium">종료일</th>
					</tr>
				</thead>
				<tbody>
					{careers.length === 0 ? (
						<tr><td colSpan={5} className="p-6 text-center text-slate-400">등록된 경력이 없습니다.</td></tr>
					) : (
						careers.map((c) => (
							<tr key={c.id} className="border-b border-slate-100">
								<td className="p-3">{c.companyName}</td>
								<td className="p-3">{c.department ?? "-"}</td>
								<td className="p-3">{c.position ?? "-"}</td>
								<td className="p-3">{c.startDate}</td>
								<td className="p-3">{c.endDate ?? "재직중"}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
