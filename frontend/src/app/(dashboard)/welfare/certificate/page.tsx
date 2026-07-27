"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
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

	return (
		<div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between bg-gradient-to-r from-orange-50 to-white p-6 rounded-2xl shadow-sm border border-orange-100/50 gap-4">
				<div>
					<nav className="mb-2 text-xs font-semibold text-orange-500 tracking-wider uppercase">
						Welfare Management <span className="mx-2 text-orange-300">/</span> Certificates
					</nav>
					<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">제증명 발급 신청</h1>
					<p className="mt-2 text-sm text-slate-600 font-medium">재직, 경력, 원천징수 등 필요 증명서를 즉시 신청하고 다운로드 받으세요.</p>
				</div>
				<button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 transition-all font-semibold px-6 py-2.5 rounded-xl border-none">
					+ 신규 증명서 발급
				</button>
			</div>

			{/* Filter */}
			<div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl shadow-sm border border-slate-200">
				<span className="text-sm font-bold text-slate-700">증명서 종류 필터</span>
				<div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-[38px] px-3">
					<select 
						value={type} 
						onChange={(e) => setType(e.target.value)}
						className="bg-transparent outline-none text-sm font-medium text-slate-700 w-36 cursor-pointer"
					>
						<option value="">모든 증명서 내역</option>
						<option value="재직증명서">재직증명서</option>
						<option value="경력증명서">경력증명서</option>
						<option value="원천징수영수증">원천징수영수증</option>
					</select>
				</div>
				<div className="ml-auto text-sm text-slate-500 font-medium">
					조회된 내역 <span className="font-bold text-orange-500">{filtered.length}</span>건
				</div>
			</div>

			{/* List Container */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm whitespace-nowrap">
						<thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
							<tr>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">신청번호</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">증명서 종류</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">신청 사유(용도)</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">신청일자</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase text-center">발급상태</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase text-right">파일 관리</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-50">
							{loading ? (
								<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">데이터를 불러오는 중입니다...</td></tr>
							) : filtered.length === 0 ? (
								<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">증명서 발급 신청 내역이 없습니다.</td></tr>
							) : (
								filtered.map((d) => (
									<tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
										<td className="px-6 py-4 font-medium text-slate-400">
											<span className="bg-slate-100 px-2 py-1 rounded-md">{d.documentNumber}</span>
										</td>
										<td className="px-6 py-4 font-bold text-slate-800">
											<span className="flex items-center gap-2">
												<span className="w-2 h-2 rounded-full bg-orange-400"></span>
												{d.certificateType}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="font-semibold text-slate-600">{d.purpose || "-"}</div>
										</td>
										<td className="px-6 py-4 font-medium text-slate-500">{d.applicationDate}</td>
										<td className="px-6 py-4 text-center">
											{d.issueStatus === "ISSUED" ? (
												<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs shadow-sm">
													발급완료
												</span>
											) : (
												<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 font-bold text-xs shadow-sm">
													발급대기
												</span>
											)}
										</td>
										<td className="px-6 py-4 text-right">
											<Button 
												variant="outline" 
												className="px-4 py-1.5 text-xs font-bold rounded-lg border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors" 
												disabled={d.issueStatus !== "ISSUED"}
											>
												PDF 다운로드
											</Button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal Overlay for Form */}
			{showForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
					<form onSubmit={submit} className="w-[480px] rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-slate-900">제증명 발급 신청</h2>
							<button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
								&times;
							</button>
						</div>
						
						<div className="space-y-5">
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">신청 교직원 <span className="text-orange-500">*</span></label>
								<select value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all font-medium" required>
									<option value="">교직원 선택</option>
									{employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeNumber})</option>))}
								</select>
							</div>
							
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">증명서 종류 <span className="text-orange-500">*</span></label>
								<select value={form.certificateType} onChange={(e) => set("certificateType", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all font-medium">
									<option value="재직증명서">재직증명서</option>
									<option value="경력증명서">경력증명서</option>
									<option value="원천징수영수증">원천징수영수증</option>
								</select>
							</div>
							
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">신청일자 <span className="text-orange-500">*</span></label>
								<input type="date" value={form.applicationDate} onChange={(e) => set("applicationDate", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all font-medium" required />
							</div>
							
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">신청 사유 (용도)</label>
								<input value={form.purpose} onChange={(e) => set("purpose", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all font-medium" placeholder="예: 은행 대출 서류 제출용" />
							</div>
						</div>
						
						<div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
							<button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">취소</button>
							<button type="submit" disabled={saving} className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 hover:bg-orange-600 disabled:opacity-60 transition-all">
								{saving ? "신청 중..." : "발급 신청"}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
