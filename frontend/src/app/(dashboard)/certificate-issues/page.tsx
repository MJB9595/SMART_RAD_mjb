"use client";

import { useEffect, useMemo, useState } from "react";
import { listCertificateIssues } from "@/lib/api/certificateIssues";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Input, Select } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import type { CertificateIssue, CertificateType } from "@/lib/types/certificateIssue";

const TYPE_LABELS: Record<CertificateType, string> = {
	EMPLOYMENT: "재직증명서",
	CAREER: "경력증명서",
};

export default function CertificateIssuesPage() {
	const [items, setItems] = useState<CertificateIssue[]>([]);
	const [keyword, setKeyword] = useState("");
	const [type, setType] = useState("");
	const [status, setStatus] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listCertificateIssues()
			.then(setItems)
			.catch((err) => setError(err instanceof ApiError ? err.message : "증명서 발급 내역을 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	const filtered = useMemo(
		() =>
			items.filter(
				(item) =>
					(!keyword || item.employeeName.includes(keyword)) &&
					(!type || item.certificateType === type) &&
					(!status || item.approvalStatus === status),
			),
		[items, keyword, type, status],
	);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				인사관리 <span className="mx-1">›</span> 증명서관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">증명서발급</span>
			</nav>

			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">증명서발급</h1>
					<p className="mt-1 text-sm text-slate-500">재직·경력증명서 등 증명서 발급 신청 내역을 관리합니다.</p>
				</div>
				<div className="flex gap-2">
					<Button variant="primary">증명서 신청</Button>
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
					<Field label="증명서종류">
						<Select value={type} onChange={(e) => setType(e.target.value)}>
							<option value="">전체</option>
							<option value="EMPLOYMENT">재직증명서</option>
							<option value="CAREER">경력증명서</option>
						</Select>
					</Field>
					<Field label="승인상태">
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
								<th className="p-3 font-medium">증명서종류</th>
								<th className="p-3 font-medium">용도</th>
								<th className="p-3 font-medium">승인상태</th>
								<th className="p-3 font-medium">발급상태</th>
								<th className="p-3 font-medium">승인자</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((item) => (
								<tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3">{item.documentNumber}</td>
									<td className="p-3">{item.employeeName}</td>
									<td className="p-3">{TYPE_LABELS[item.certificateType]}</td>
									<td className="p-3">{item.purpose ?? "-"}</td>
									<td className="p-3">
										<StatusBadge status={item.approvalStatus} />
									</td>
									<td className="p-3">
										<StatusBadge status={item.issueStatus} />
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
