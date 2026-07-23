"use client";

import { useEffect, useState } from "react";
import { Button, Field, Select } from "@/components/ui";
import { listCertificates, type Certificate } from "@/lib/api/welfare";

export default function CertificatePage() {
	const [type, setType] = useState("");
	const [rows, setRows] = useState<Certificate[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		listCertificates()
			.then((data) => active && setRows(data))
			.catch(() => active && setRows([]))
			.finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, []);

	const filtered = type ? rows.filter((d) => d.certificateType === type) : rows;

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
					{loading ? (
						<tr><td colSpan={6} className="p-6 text-center text-slate-400">불러오는 중...</td></tr>
					) : filtered.length === 0 ? (
						<tr><td colSpan={6} className="p-6 text-center text-slate-400">증명서 신청 내역이 없습니다.</td></tr>
					) : (
						filtered.map((d) => (
							<tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
								<td className="p-3 text-slate-500">{d.documentNumber}</td>
								<td className="p-3 font-medium text-slate-900">{d.certificateType}</td>
								<td className="p-3">{d.purpose || "-"}</td>
								<td className="p-3 text-slate-500">{d.applicationDate}</td>
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
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
