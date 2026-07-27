"use client";

import { useEffect, useState } from "react";
import { Button, Field, Select } from "@/components/ui";
import { listCertificates, createCertificate, type Certificate } from "@/lib/api/welfare";
import { searchEmployees } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";
import type { Employee } from "@/lib/types/employee";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function CertificatePage() {
	const [type, setType] = useState("");
	const [rows, setRows] = useState<Certificate[]>([]);
	const [loading, setLoading] = useState(true);

	// 신청 폼
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState({ employeeId: "", certificateType: "재직증명서", applicationDate: today(), purpose: "" });
	const [saving, setSaving] = useState(false);

	function reload() {
		setLoading(true);
		listCertificates().then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
	}

	useEffect(() => {
		reload();
		searchEmployees({ size: 200 }).then((res) => setEmployees(res.content)).catch(() => setEmployees([]));
	}, []);

	const filtered = type ? rows.filter((d) => d.certificateType === type) : rows;

	function set(k: string, v: string) {
		setForm((f) => ({ ...f, [k]: v }));
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.employeeId) {
			alert("신청 교직원을 선택하세요.");
			return;
		}
		setSaving(true);
		try {
			await createCertificate({
				employeeId: Number(form.employeeId),
				certificateType: form.certificateType,
				applicationDate: form.applicationDate,
				purpose: form.purpose.trim() || null,
			});
			setShowForm(false);
			setForm({ employeeId: "", certificateType: "재직증명서", applicationDate: today(), purpose: "" });
			reload();
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "증명서 신청에 실패했습니다.");
		} finally {
			setSaving(false);
		}
	}

	const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

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
				<Button onClick={() => setShowForm(true)}>증명서 신청</Button>
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

			{showForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
					<form onSubmit={submit} className="w-[440px] max-w-[95vw] rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-bold text-slate-900">증명서 신청</h2>
							<button type="button" onClick={() => setShowForm(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-600">&times;</button>
						</div>
						<div className="space-y-3">
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">신청 교직원</label>
								<select value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} className={inputCls} required>
									<option value="">교직원 선택</option>
									{employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeNumber})</option>))}
								</select>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">증명서 종류</label>
								<select value={form.certificateType} onChange={(e) => set("certificateType", e.target.value)} className={inputCls}>
									<option value="재직증명서">재직증명서</option>
									<option value="경력증명서">경력증명서</option>
									<option value="원천징수영수증">원천징수영수증</option>
								</select>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">신청일</label>
								<input type="date" value={form.applicationDate} onChange={(e) => set("applicationDate", e.target.value)} className={inputCls} required />
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">신청 사유 (용도)</label>
								<input value={form.purpose} onChange={(e) => set("purpose", e.target.value)} className={inputCls} placeholder="예: 은행 제출용" />
							</div>
						</div>
						<div className="mt-5 flex justify-end gap-2">
							<button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">취소</button>
							<button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "신청 중..." : "신청"}</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
