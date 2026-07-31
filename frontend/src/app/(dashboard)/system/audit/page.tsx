"use client";

import { useEffect, useMemo, useState } from "react";
import { listAuditLogs } from "@/lib/api/system";
import { ApiError } from "@/lib/api/client";
import type { AuditLog } from "@/lib/types/system";

const ACTION_LABEL: Record<string, string> = {
	CREATE: "생성",
	UPDATE: "수정",
	DELETE: "삭제",
	ACTIVATE: "활성화",
	DEACTIVATE: "비활성화",
	APPROVE: "승인",
	REJECT: "반려",
	LOGIN: "로그인",
};

/** 행위별 강조색 — 삭제/비활성은 눈에 띄어야 하고, 승인은 확정 의미라 초록. */
const ACTION_PILL: Record<string, string> = {
	CREATE: "blue",
	UPDATE: "amber",
	DELETE: "red",
	DEACTIVATE: "red",
	ACTIVATE: "green",
	APPROVE: "green",
	REJECT: "red",
};

const ENTITY_LABEL: Record<string, string> = {
	APPOINTMENT: "인사발령",
	LEAVE_REQUEST: "휴가신청",
	EMPLOYEE: "교직원",
	COMMON_CODE: "공통코드",
	ROLE: "권한 역할",
};

export default function AuditPage() {
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [entity, setEntity] = useState("");

	useEffect(() => {
		listAuditLogs(100)
			.then((page) => setLogs(page.content))
			.catch((err) => setError(err instanceof ApiError ? err.message : "감사로그를 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	const entities = useMemo(
		() => [...new Set(logs.map((a) => a.entityType).filter((e): e is string => !!e))],
		[logs],
	);
	const filtered = useMemo(() => logs.filter((a) => !entity || a.entityType === entity), [logs, entity]);

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">감사로그 조회</div>
					<div className="page-sub">권한 변경·승인 등 주요 업무 행위의 이력을 최신순으로 조회합니다.</div>
				</div>
			</div>

			<div className="bg-white rounded-2xl border border-slate-100 mb-5 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<span className="text-[13px] font-bold text-slate-700 whitespace-nowrap">대상</span>
					<select value={entity} onChange={(e) => setEntity(e.target.value)} className="filter-select flex-1 sm:flex-none">
						<option value="">전체 대상</option>
						{entities.map((e) => (
							<option key={e} value={e}>{ENTITY_LABEL[e] ?? e}</option>
						))}
					</select>
				</div>
				<div className="text-[12.5px] text-slate-400 sm:ml-auto text-right sm:text-left">
					조회된 이력 <span className="font-extrabold text-indigo-700">{filtered.length}</span>건
				</div>
			</div>

			<div className="card">
				<div className="overflow-x-auto">
					<table className="w-full whitespace-nowrap min-w-[600px] hidden lg:table">
						<thead>
							<tr>
								<th style={{ width: "180px" }}>일시</th>
								<th>행위자</th>
								<th style={{ textAlign: "center", width: "110px" }}>행위</th>
								<th>대상</th>
								<th style={{ width: "100px" }}>대상 ID</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr className="empty-row"><td colSpan={5}>데이터를 불러오는 중입니다...</td></tr>
							) : error ? (
								<tr className="empty-row"><td colSpan={5}>{error}</td></tr>
							) : filtered.length === 0 ? (
								<tr className="empty-row"><td colSpan={5}>기록된 감사로그가 없습니다.</td></tr>
							) : (
								filtered.map((a) => (
									<tr key={a.id}>
										<td className="mono" style={{ color: "#6B7280" }}>{a.createdAt.replace("T", " ").slice(0, 19)}</td>
										<td>
											{a.actorName ? (
												<>
													<span style={{ fontWeight: 700 }}>{a.actorName}</span>
													<span style={{ color: "#B0B7C3", marginLeft: "6px", fontSize: "12px" }}>#{a.actorId}</span>
												</>
											) : (
												<span style={{ color: "#B0B7C3" }}>시스템</span>
											)}
										</td>
										<td style={{ textAlign: "center" }}>
											<span className={`pill ${ACTION_PILL[a.action] ?? "gray"}`}>{ACTION_LABEL[a.action] ?? a.action}</span>
										</td>
										<td>{a.entityType ? ENTITY_LABEL[a.entityType] ?? a.entityType : "-"}</td>
										<td className="mono" style={{ color: "#6B7280" }}>{a.entityId ?? "-"}</td>
									</tr>
								))
							)}
						</tbody>
					</table>

					{/* Mobile Card View */}
					<div className="lg:hidden flex flex-col gap-4 p-4 bg-slate-50/50">
						{loading ? (
							<div className="text-center text-slate-400 py-8 text-sm">데이터를 불러오는 중입니다...</div>
						) : error ? (
							<div className="text-center text-red-400 py-8 text-sm">{error}</div>
						) : filtered.length === 0 ? (
							<div className="text-center text-slate-400 py-8 text-sm">기록된 감사로그가 없습니다.</div>
						) : (
							filtered.map((a) => (
								<div key={a.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
									<div className="flex justify-between items-start border-b border-slate-100 pb-3">
										<div className="flex flex-col gap-1">
											<span className="text-[11px] font-mono text-slate-400">{a.createdAt.replace("T", " ").slice(0, 19)}</span>
											<div className="font-bold text-slate-900 flex items-center gap-2">
												{a.actorName ? (
													<>
														<span>{a.actorName}</span>
														<span className="text-slate-400 font-normal text-[12px]">#{a.actorId}</span>
													</>
												) : (
													<span className="text-slate-400">시스템</span>
												)}
											</div>
										</div>
										<div className="scale-90 origin-top-right">
											<span className={`pill ${ACTION_PILL[a.action] ?? "gray"}`}>{ACTION_LABEL[a.action] ?? a.action}</span>
										</div>
									</div>
									<div className="flex justify-between items-center text-sm pt-1">
										<span className="text-slate-500 font-medium">대상</span>
										<span className="text-slate-700 font-bold">{a.entityType ? ENTITY_LABEL[a.entityType] ?? a.entityType : "-"}</span>
									</div>
									<div className="flex justify-between items-center text-sm pb-1">
										<span className="text-slate-500 font-medium">대상 ID</span>
										<span className="font-mono text-slate-600">{a.entityId ?? "-"}</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</>
	);
}
