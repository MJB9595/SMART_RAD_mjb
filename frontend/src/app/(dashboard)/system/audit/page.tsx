"use client";

import { useEffect, useState } from "react";
import { listAuditLogs } from "@/lib/api/system";
import { ApiError } from "@/lib/api/client";
import type { AuditLog } from "@/lib/types/system";

const ACTION_LABEL: Record<string, string> = {
	CREATE: "생성",
	UPDATE: "수정",
	DELETE: "삭제",
	APPROVE: "승인",
	REJECT: "반려",
	LOGIN: "로그인",
};

const ENTITY_LABEL: Record<string, string> = {
	APPOINTMENT: "인사발령",
	LEAVE_REQUEST: "휴가신청",
	EMPLOYEE: "교직원",
	COMMON_CODE: "공통코드",
};

export default function AuditPage() {
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listAuditLogs()
			.then((page) => setLogs(page.content))
			.catch((err) => setError(err instanceof ApiError ? err.message : "감사로그를 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				시스템 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">감사로그 조회</span>
			</nav>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">감사로그 조회</h1>
				<p className="mt-1 text-sm text-slate-500">주요 업무 행위(승인·변경 등)의 이력을 조회합니다.</p>
			</div>

			{loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && !error && (
				<>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
								<th className="p-3 font-medium">일시</th>
								<th className="p-3 font-medium">행위자 ID</th>
								<th className="p-3 font-medium">행위</th>
								<th className="p-3 font-medium">대상</th>
								<th className="p-3 font-medium">대상 ID</th>
							</tr>
						</thead>
						<tbody>
							{logs.map((a) => (
								<tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3">{a.createdAt.replace("T", " ").slice(0, 19)}</td>
									<td className="p-3">{a.actorId ?? "-"}</td>
									<td className="p-3">{ACTION_LABEL[a.action] ?? a.action}</td>
									<td className="p-3">{a.entityType ? ENTITY_LABEL[a.entityType] ?? a.entityType : "-"}</td>
									<td className="p-3">{a.entityId ?? "-"}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-4 text-sm text-slate-500">총 {logs.length}건</div>
				</>
			)}
		</div>
	);
}
