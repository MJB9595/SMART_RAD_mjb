"use client";

import { useEffect, useState } from "react";
import { Button, Field, Select } from "@/components/ui";
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

	const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

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
				<Button onClick={() => setShowForm(true)}>경조비 신청</Button>
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

			{showForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
					<form onSubmit={submit} className="w-[460px] max-w-[95vw] rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-bold text-slate-900">경조비 신청</h2>
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
							<div className="flex gap-3">
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium text-slate-700">경조 구분</label>
									<select value={form.eventType} onChange={(e) => set("eventType", e.target.value)} className={inputCls}>
										<option value="결혼">결혼</option><option value="출산">출산</option><option value="사망">사망</option><option value="기타">기타</option>
									</select>
								</div>
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium text-slate-700">가족관계</label>
									<input value={form.familyRelation} onChange={(e) => set("familyRelation", e.target.value)} className={inputCls} placeholder="본인/배우자 등" />
								</div>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">대상자</label>
								<input value={form.targetName} onChange={(e) => set("targetName", e.target.value)} className={inputCls} required />
							</div>
							<div className="flex gap-3">
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium text-slate-700">신청일</label>
									<input type="date" value={form.applicationDate} onChange={(e) => set("applicationDate", e.target.value)} className={inputCls} required />
								</div>
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium text-slate-700">경조일</label>
									<input type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} className={inputCls} required />
								</div>
							</div>
							<div className="flex gap-3">
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium text-slate-700">신청금액 (원)</label>
									<input type="number" min="0" value={form.requestedAmount} onChange={(e) => set("requestedAmount", e.target.value)} className={inputCls} required />
								</div>
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium text-slate-700">장소</label>
									<input value={form.eventLocation} onChange={(e) => set("eventLocation", e.target.value)} className={inputCls} placeholder="선택" />
								</div>
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
