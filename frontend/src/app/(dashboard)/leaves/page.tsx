"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { approveLeave, listLeaveRequests, rejectLeave } from "@/lib/api/leaves";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Select } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import type { LeaveRequest, LeaveType } from "@/lib/types/leave";

const TYPE_LABELS: Record<LeaveType, string> = {
	ANNUAL: "연차",
	SICK: "병가",
	OFFICIAL: "공가",
	SPECIAL: "특별휴가",
	PARENTAL: "육아휴직",
};

export default function LeavesPage() {
	const [items, setItems] = useState<LeaveRequest[]>([]);
	const [status, setStatus] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const load = useCallback(() => {
		setLoading(true);
		setError(null);
		listLeaveRequests()
			.then((page) => setItems(page.content))
			.catch((err) => setError(err instanceof ApiError ? err.message : "휴가 내역을 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	async function decide(id: number, action: "approve" | "reject") {
		try {
			if (action === "approve") await approveLeave(id);
			else await rejectLeave(id);
			load();
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "처리에 실패했습니다.");
		}
	}

	const filtered = useMemo(
		() => items.filter((i) => !status || i.approvalStatus === status),
		[items, status],
	);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				근태·휴가 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">휴가 신청/승인</span>
			</nav>

			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">휴가 신청/승인</h1>
					<p className="mt-1 text-sm text-slate-500">휴가 신청 내역을 조회하고 승인합니다. (연차 승인 시 잔여일수 자동 차감)</p>
				</div>
				<Button variant="primary">휴가 신청</Button>
			</div>

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex flex-wrap items-end gap-4">
					<Field label="처리상태">
						<Select value={status} onChange={(e) => setStatus(e.target.value)}>
							<option value="">전체</option>
							<option value="PENDING">대기</option>
							<option value="APPROVED">승인</option>
							<option value="REJECTED">반려</option>
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
								<th className="p-3 font-medium">신청번호</th>
								<th className="p-3 font-medium">신청자</th>
								<th className="p-3 font-medium">휴가유형</th>
								<th className="p-3 font-medium">기간</th>
								<th className="p-3 font-medium">일수</th>
								<th className="p-3 font-medium">상태</th>
								<th className="p-3 font-medium">처리</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((i) => (
								<tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3">{i.documentNumber}</td>
									<td className="p-3">{i.employeeName}</td>
									<td className="p-3">{TYPE_LABELS[i.leaveType]}</td>
									<td className="p-3">{i.startDate} ~ {i.endDate}</td>
									<td className="p-3">{i.days}일</td>
									<td className="p-3"><StatusBadge status={i.approvalStatus} /></td>
									<td className="p-3">
										{i.approvalStatus === "PENDING" ? (
											<div className="flex gap-1">
												<button
													onClick={() => decide(i.id, "approve")}
													className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
												>
													승인
												</button>
												<button
													onClick={() => decide(i.id, "reject")}
													className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-600"
												>
													반려
												</button>
											</div>
										) : (
											<span className="text-xs text-slate-400">{i.approverName ?? "-"}</span>
										)}
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
