"use client";

import { useEffect, useMemo, useState } from "react";
import { listCommonCodes } from "@/lib/api/system";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Select } from "@/components/ui";
import type { CommonCode } from "@/lib/types/system";

export default function CodesPage() {
	const [codes, setCodes] = useState<CommonCode[]>([]);
	const [group, setGroup] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listCommonCodes()
			.then(setCodes)
			.catch((err) => setError(err instanceof ApiError ? err.message : "공통코드를 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	const groups = useMemo(() => [...new Set(codes.map((c) => c.groupCode))], [codes]);
	const filtered = useMemo(() => codes.filter((c) => !group || c.groupCode === group), [codes, group]);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				시스템 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">공통 코드 관리</span>
			</nav>

			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">공통 코드 관리</h1>
					<p className="mt-1 text-sm text-slate-500">휴가유형·발령유형 등 시스템 공통 코드를 관리합니다.</p>
				</div>
				<Button variant="primary">코드 등록</Button>
			</div>

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex items-end gap-4">
					<Field label="코드그룹">
						<Select value={group} onChange={(e) => setGroup(e.target.value)}>
							<option value="">전체</option>
							{groups.map((g) => (
								<option key={g} value={g}>{g}</option>
							))}
						</Select>
					</Field>
				</div>
			</div>

			{loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && !error && (
				<>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
								<th className="p-3 font-medium">코드그룹</th>
								<th className="p-3 font-medium">코드</th>
								<th className="p-3 font-medium">코드명</th>
								<th className="p-3 font-medium">정렬순서</th>
								<th className="p-3 font-medium">상태</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((c) => (
								<tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3 text-slate-500">{c.groupCode}</td>
									<td className="p-3 font-medium">{c.code}</td>
									<td className="p-3">{c.name}</td>
									<td className="p-3">{c.sortOrder}</td>
									<td className="p-3">
										<span className={c.active ? "text-blue-600" : "text-slate-400"}>
											{c.active ? "활성" : "비활성"}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-4 text-sm text-slate-500">총 {filtered.length}건</div>
				</>
			)}
		</div>
	);
}
