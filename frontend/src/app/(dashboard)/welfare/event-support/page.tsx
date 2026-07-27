"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import { listEventSupports, createEventSupport, type EventSupport } from "@/lib/api/welfare";
import { searchEmployees } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";
import type { Employee } from "@/lib/types/employee";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function EventSupportPage() {
	const [type, setType] = useState("");
	const [rows, setRows] = useState<EventSupport[]>([]);
	const [loading, setLoading] = useState(true);

	// 신청 폼
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState({
		employeeId: "",
		eventType: "결혼",
		familyRelation: "본인",
		targetName: "",
		applicationDate: today(),
		eventDate: today(),
		requestedAmount: "",
		eventLocation: "",
	});
	const [saving, setSaving] = useState(false);

	function reload() {
		setLoading(true);
		listEventSupports().then(setRows).catch(() => setRows([])).finally(() => setLoading(false));
	}

	useEffect(() => {
		reload();
		searchEmployees({ size: 200 }).then((res) => setEmployees(res.content)).catch(() => setEmployees([]));
	}, []);

	const filtered = type ? rows.filter((d) => d.eventType === type) : rows;

	function set(k: string, v: string) {
		setForm((f) => ({ ...f, [k]: v }));
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.employeeId || !form.targetName.trim() || !form.requestedAmount) {
			alert("교직원·대상자·신청금액을 입력하세요.");
			return;
		}
		setSaving(true);
		try {
			await createEventSupport({
				employeeId: Number(form.employeeId),
				eventType: form.eventType,
				familyRelation: form.familyRelation || null,
				targetName: form.targetName.trim(),
				applicationDate: form.applicationDate,
				eventDate: form.eventDate,
				requestedAmount: Number(form.requestedAmount),
				eventLocation: form.eventLocation || null,
			});
			setShowForm(false);
			setForm({ employeeId: "", eventType: "결혼", familyRelation: "본인", targetName: "", applicationDate: today(), eventDate: today(), requestedAmount: "", eventLocation: "" });
			reload();
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "경조비 신청에 실패했습니다.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between bg-gradient-to-r from-rose-50 to-white p-6 rounded-2xl shadow-sm border border-rose-100/50 gap-4">
				<div>
					<nav className="mb-2 text-xs font-semibold text-rose-500 tracking-wider uppercase">
						Welfare Management <span className="mx-2 text-rose-300">/</span> Event Support
					</nav>
					<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">경조비 신청 내역</h1>
					<p className="mt-2 text-sm text-slate-600 font-medium">직원 본인 및 가족의 경조사 지원금을 신청하고 결재 상태를 관리합니다.</p>
				</div>
				<button onClick={() => setShowForm(true)} className="bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 transition-all font-semibold px-6 py-2.5 rounded-xl border-none">
					+ 경조비 신규 신청
				</button>
			</div>

			{/* Filter */}
			<div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl shadow-sm border border-slate-200">
				<span className="text-sm font-bold text-slate-700">경조 구분 검색</span>
				<div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-[38px] px-3">
					<select 
						value={type} 
						onChange={(e) => setType(e.target.value)}
						className="bg-transparent outline-none text-sm font-medium text-slate-700 w-32 cursor-pointer"
					>
						<option value="">전체 내역</option>
						<option value="결혼">결혼</option>
						<option value="출산">출산</option>
						<option value="사망">사망</option>
						<option value="기타">기타</option>
					</select>
				</div>
				<div className="ml-auto text-sm text-slate-500 font-medium">
					총 <span className="font-bold text-rose-500">{filtered.length}</span>건의 신청 내역
				</div>
			</div>

			{/* List Container */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm whitespace-nowrap">
						<thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
							<tr>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">신청번호</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">경조구분</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">대상자</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase text-right">신청금액</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">경조일자</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase text-center">결재상태</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-50">
							{loading ? (
								<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">데이터를 불러오는 중입니다...</td></tr>
							) : filtered.length === 0 ? (
								<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">조회된 경조비 신청 내역이 없습니다.</td></tr>
							) : (
								filtered.map((d) => (
									<tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
										<td className="px-6 py-4 font-medium text-slate-400">
											<span className="bg-slate-100 px-2 py-1 rounded-md">{d.documentNumber}</span>
										</td>
										<td className="px-6 py-4 font-bold text-slate-800">
											<span className="flex items-center gap-2">
												<span className="w-2 h-2 rounded-full bg-rose-400"></span>
												{d.eventType}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="font-semibold text-slate-900">{d.targetName}</div>
										</td>
										<td className="px-6 py-4 text-right font-bold text-slate-700">
											{d.requestedAmount?.toLocaleString()}원
										</td>
										<td className="px-6 py-4 font-medium text-slate-500">{d.eventDate}</td>
										<td className="px-6 py-4 text-center">
											<StatusBadge status={d.approvalStatus as never} />
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
					<form onSubmit={submit} className="w-[500px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-slate-900">경조비 신규 신청</h2>
							<button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
								&times;
							</button>
						</div>
						
						<div className="space-y-5">
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">신청 교직원 <span className="text-rose-500">*</span></label>
								<select value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-medium" required>
									<option value="">교직원 선택</option>
									{employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeNumber})</option>))}
								</select>
							</div>
							
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">경조 구분 <span className="text-rose-500">*</span></label>
									<select value={form.eventType} onChange={(e) => set("eventType", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-medium">
										<option value="결혼">결혼</option><option value="출산">출산</option><option value="사망">사망</option><option value="기타">기타</option>
									</select>
								</div>
								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">가족 관계</label>
									<input value={form.familyRelation} onChange={(e) => set("familyRelation", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-medium" placeholder="본인/배우자 등" />
								</div>
							</div>
							
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">대상자 성명 <span className="text-rose-500">*</span></label>
								<input value={form.targetName} onChange={(e) => set("targetName", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-medium" required />
							</div>
							
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">신청일자 <span className="text-rose-500">*</span></label>
									<input type="date" value={form.applicationDate} onChange={(e) => set("applicationDate", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-medium" required />
								</div>
								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">실제 경조일 <span className="text-rose-500">*</span></label>
									<input type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-medium" required />
								</div>
							</div>
							
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">신청 금액 (원) <span className="text-rose-500">*</span></label>
									<input type="number" min="0" value={form.requestedAmount} onChange={(e) => set("requestedAmount", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-medium" required />
								</div>
								<div>
									<label className="mb-1.5 block text-sm font-semibold text-slate-700">장소 (선택)</label>
									<input value={form.eventLocation} onChange={(e) => set("eventLocation", e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all font-medium" placeholder="식장 등 기입" />
								</div>
							</div>
						</div>
						
						<div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
							<button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">취소</button>
							<button type="submit" disabled={saving} className="rounded-xl bg-rose-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-rose-700 disabled:opacity-60 transition-all">
								{saving ? "처리 중..." : "신청 완료"}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
