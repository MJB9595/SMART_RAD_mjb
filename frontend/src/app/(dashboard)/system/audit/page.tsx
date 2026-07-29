"use client";

import { useEffect, useMemo, useState } from "react";
import { listAuditLogs } from "@/lib/api/system";
import { ApiError } from "@/lib/api/client";
import type { AuditLog } from "@/lib/types/system";
import { ScrollText } from "lucide-react";

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
					<div className="page-title flex items-center gap-2">
						<ScrollText className="w-6 h-6 text-indigo-600" />
						감사로그 조회
					</div>
					<div className="page-sub">권한 변경·승인 등 주요 업무 행위의 이력을 최신순으로 조회합니다.</div>
				</div>
			</div>

			<div className="filter-bar" style={{ background: "#fff", borderRadius: "14px", border: "1px solid #EEF0F3", marginBottom: "20px" }}>
				<span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>대상</span>
				<select value={entity} onChange={(e) => setEntity(e.target.value)} className="filter-select">
					<option value="">전체 대상</option>
					{entities.map((e) => (
						<option key={e} value={e}>{ENTITY_LABEL[e] ?? e}</option>
					))}
				</select>
				<div style={{ marginLeft: "auto", fontSize: "12.5px", color: "#8A94A6" }}>
					조회된 이력 <span style={{ fontWeight: 800, color: "#1F3A8F" }}>{filtered.length}</span>건
				</div>
			</div>

			<div className="card">
				<div className="overflow-x-auto">
					<table>
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
				</div>
			</div>
		</>
	);
}
