"use client";

import { useEffect, useState } from "react";
import { listRoles } from "@/lib/api/system";
import { ApiError } from "@/lib/api/client";
import type { RoleInfo } from "@/lib/types/system";

export default function RolesPage() {
	const [roles, setRoles] = useState<RoleInfo[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listRoles()
			.then(setRoles)
			.catch((err) => setError(err instanceof ApiError ? err.message : "권한 정보를 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				시스템 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">권한 관리</span>
			</nav>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">권한 관리 (RBAC)</h1>
				<p className="mt-1 text-sm text-slate-500">역할별 권한 구성을 조회합니다.</p>
			</div>

			{loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && !error && (
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
							<th className="p-3 font-medium">역할코드</th>
							<th className="p-3 font-medium">역할명</th>
							<th className="p-3 font-medium">설명</th>
							<th className="p-3 font-medium">권한</th>
							<th className="p-3 font-medium">상태</th>
						</tr>
					</thead>
					<tbody>
						{roles.map((r) => (
							<tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
								<td className="p-3 font-medium">{r.code}</td>
								<td className="p-3">{r.name}</td>
								<td className="p-3 text-slate-500">{r.description ?? "-"}</td>
								<td className="p-3">
									{r.permissions.length === 0 ? (
										<span className="text-slate-400">전체 권한</span>
									) : (
										<div className="flex flex-wrap gap-1">
											{r.permissions.map((p) => (
												<span key={p} className="rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-600">
													{p}
												</span>
											))}
										</div>
									)}
								</td>
								<td className="p-3">
									<span className={r.active ? "text-blue-600" : "text-slate-400"}>
										{r.active ? "활성" : "비활성"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
