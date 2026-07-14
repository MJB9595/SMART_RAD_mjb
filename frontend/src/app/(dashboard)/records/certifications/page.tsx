"use client";

import { useEffect, useState } from "react";
import { searchEmployees } from "@/lib/api/employees";
import { getCertifications } from "@/lib/api/records";
import { ApiError } from "@/lib/api/client";
import { Field, Select } from "@/components/ui";
import type { Certification, Employee } from "@/lib/types/employee";

export default function CertificationsPage() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [selected, setSelected] = useState<string>("");
	const [certifications, setCertifications] = useState<Certification[]>([]);
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
		getCertifications(Number(selected)).then(setCertifications).catch(() => setCertifications([]));
	}, [selected]);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				인사기록 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">자격증 관리</span>
			</nav>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">자격증 관리</h1>
				<p className="mt-1 text-sm text-slate-500">교직원별 보유 자격증을 조회하고 만료일을 관리합니다.</p>
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

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
						<th className="p-3 font-medium">자격증명</th>
						<th className="p-3 font-medium">발급기관</th>
						<th className="p-3 font-medium">자격번호</th>
						<th className="p-3 font-medium">취득일</th>
						<th className="p-3 font-medium">만료일</th>
					</tr>
				</thead>
				<tbody>
					{certifications.length === 0 ? (
						<tr><td colSpan={5} className="p-6 text-center text-slate-400">등록된 자격증이 없습니다.</td></tr>
					) : (
						certifications.map((c) => (
							<tr key={c.id} className="border-b border-slate-100">
								<td className="p-3">{c.name}</td>
								<td className="p-3">{c.issuer ?? "-"}</td>
								<td className="p-3">{c.certNumber ?? "-"}</td>
								<td className="p-3">{c.acquiredDate ?? "-"}</td>
								<td className="p-3">{c.expiryDate ?? "-"}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
