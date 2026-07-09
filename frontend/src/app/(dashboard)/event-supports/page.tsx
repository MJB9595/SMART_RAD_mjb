"use client";

import { useEffect, useMemo, useState } from "react";
import { listEventSupports } from "@/lib/api/eventSupports";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Input, Select } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import type { EventSupport, EventType } from "@/lib/types/eventSupport";

const TYPE_LABELS: Record<EventType, string> = {
	MARRIAGE: "결혼",
	CHILDBIRTH: "출산",
	BEREAVEMENT: "사망",
	OTHER: "기타",
};

export default function EventSupportsPage() {
	const [items, setItems] = useState<EventSupport[]>([]);
	const [keyword, setKeyword] = useState("");
	const [type, setType] = useState("");
	const [status, setStatus] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listEventSupports()
			.then(setItems)
			.catch((err) => setError(err instanceof ApiError ? err.message : "경조비 신청 내역을 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	const filtered = useMemo(
		() =>
			items.filter(
				(item) =>
					(!keyword || item.employeeName.includes(keyword)) &&
					(!type || item.eventType === type) &&
					(!status || item.approvalStatus === status),
			),
		[items, keyword, type, status],
	);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				인사관리 <span className="mx-1">›</span> 경조비관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">경조비신청</span>
			</nav>

			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">경조비신청</h1>
					<p className="mt-1 text-sm text-slate-500">임직원의 경조사 지원금 신청 내역을 관리합니다.</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">엑셀 다운로드</Button>
					<Button variant="primary">경조비 신청</Button>
				</div>
			</div>

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex flex-wrap items-end gap-4">
					<Field label="신청자">
						<Input
							placeholder="이름 입력"
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						/>
					</Field>
					<Field label="경조구분">
						<Select value={type} onChange={(e) => setType(e.target.value)}>
							<option value="">전체</option>
							<option value="MARRIAGE">결혼</option>
							<option value="CHILDBIRTH">출산</option>
							<option value="BEREAVEMENT">사망</option>
							<option value="OTHER">기타</option>
						</Select>
					</Field>
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
								<th className="p-3 font-medium">경조구분</th>
								<th className="p-3 font-medium">신청일</th>
								<th className="p-3 font-medium">지급금액</th>
								<th className="p-3 font-medium">처리상태</th>
								<th className="p-3 font-medium">승인자</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((item) => (
								<tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3">{item.documentNumber}</td>
									<td className="p-3">{item.employeeName}</td>
									<td className="p-3">{TYPE_LABELS[item.eventType]}</td>
									<td className="p-3">{item.eventDate}</td>
									<td className="p-3">{item.amount.toLocaleString()}원</td>
									<td className="p-3">
										<StatusBadge status={item.approvalStatus} />
									</td>
									<td className="p-3">{item.approverName ?? "-"}</td>
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
