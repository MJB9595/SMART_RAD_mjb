"use client";

import { useState } from "react";
import { Button, Field, Input, Select } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";

const MOCK_DATA = [
	{ id: 1, docNo: "CERT-2026-001", type: "재직증명서", purpose: "은행 제출용 (대출)", date: "2026-07-14", issueStatus: "ISSUED" },
	{ id: 2, docNo: "CERT-2026-002", type: "경력증명서", purpose: "개인 소장용", date: "2026-07-15", issueStatus: "WAITING" },
];

export default function CertificatePage() {
	const [type, setType] = useState("");

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				복지·증명 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">증명서 발급</span>
			</nav>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">제증명 발급 신청</h1>
					<p className="mt-1 text-sm text-slate-500">재직, 경력, 원천징수 등 증명서를 신청하고 발급받습니다.</p>
				</div>
				<Button>증명서 신청</Button>
			</div>

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex flex-wrap items-end gap-4">
					<Field label="증명서 종류">
						<Select value={type} onChange={(e) => setType(e.target.value)}>
							<option value="">전체</option>
							<option value="재직증명서">재직증명서</option>
							<option value="경력증명서">경력증명서</option>
							<option value="원천징수영수증">원천징수영수증</option>
						</Select>
					</Field>
				</div>
			</div>

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
						<th className="p-3 font-medium">신청번호</th>
						<th className="p-3 font-medium">증명서 종류</th>
						<th className="p-3 font-medium">신청사유 (용도)</th>
						<th className="p-3 font-medium">신청일자</th>
						<th className="p-3 font-medium">발급상태</th>
						<th className="p-3 font-medium">다운로드</th>
					</tr>
				</thead>
				<tbody>
					{MOCK_DATA.map((d) => (
						<tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
							<td className="p-3 text-slate-500">{d.docNo}</td>
							<td className="p-3 font-medium text-slate-900">{d.type}</td>
							<td className="p-3">{d.purpose}</td>
							<td className="p-3 text-slate-500">{d.date}</td>
							<td className="p-3">
								{d.issueStatus === "ISSUED" ? (
									<span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">발급완료</span>
								) : (
									<span className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-600">발급대기</span>
								)}
							</td>
							<td className="p-3">
								<Button variant="outline" className="px-3 py-1 text-xs" disabled={d.issueStatus !== "ISSUED"}>
									PDF 다운로드
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
