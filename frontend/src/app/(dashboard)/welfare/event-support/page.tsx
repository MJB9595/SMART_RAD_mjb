"use client";

import { useEffect, useState } from "react";
import { Button, Field, Select } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { listEventSupports, type EventSupport } from "@/lib/api/welfare";

export default function EventSupportPage() {
	const [type, setType] = useState("");
	const [rows, setRows] = useState<EventSupport[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		listEventSupports()
			.then((data) => active && setRows(data))
			.catch(() => active && setRows([]))
			.finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, []);

	const filtered = type ? rows.filter((d) => d.eventType === type) : rows;

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				복지·증명 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">경조비 신청/승인</span>
			</nav>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">경조비 신청 내역</h1>
					<p className="mt-1 text-sm text-slate-500">직원 본인 및 가족의 경조사 지원금을 신청하고 관리합니다.</p>
				</div>
				<Button>경조비 신청</Button>
			</div>

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex flex-wrap items-end gap-4">
					<Field label="경조구분">
						<Select value={type} onChange={(e) => setType(e.target.value)}>
							<option value="">전체</option>
							<option value="결혼">결혼</option>
							<option value="출산">출산</option>
							<option value="사망">사망</option>
						</Select>
					</Field>
				</div>
			</div>

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
						<th className="p-3 font-medium">신청번호</th>
						<th className="p-3 font-medium">경조구분</th>
						<th className="p-3 font-medium">대상자</th>
						<th className="p-3 font-medium text-right">신청금액</th>
						<th className="p-3 font-medium">경조일자</th>
						<th className="p-3 font-medium">결재상태</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr><td colSpan={6} className="p-6 text-center text-slate-400">불러오는 중...</td></tr>
					) : filtered.length === 0 ? (
						<tr><td colSpan={6} className="p-6 text-center text-slate-400">경조비 신청 내역이 없습니다.</td></tr>
					) : (
						filtered.map((d) => (
							<tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
								<td className="p-3 text-slate-500">{d.documentNumber}</td>
								<td className="p-3 font-medium text-slate-900">{d.eventType}</td>
								<td className="p-3">{d.targetName}</td>
								<td className="p-3 text-right font-medium">{d.requestedAmount?.toLocaleString()}원</td>
								<td className="p-3 text-slate-500">{d.eventDate}</td>
								<td className="p-3"><StatusBadge status={d.approvalStatus as never} /></td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
