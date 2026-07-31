"use client";

import { useEffect, useState } from "react";
import { listEventSupports, createEventSupport, approveEventSupport, rejectEventSupport, type EventSupport } from "@/lib/api/welfare";
import { listSelectableEmployees } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";
import type { SelectableEmployee } from "@/lib/types/employee";
import { useAuth } from "@/lib/auth/AuthContext";
import { canApproveTarget } from "@/lib/auth/permissions";
import { useFeedback } from "@/components/feedback/FeedbackProvider";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function EventSupportPage() {
	const { notify, confirm: askConfirm, prompt: askPrompt } = useFeedback();
	const [type, setType] = useState("");
	const [rows, setRows] = useState<EventSupport[]>([]);
	const [loading, setLoading] = useState(true);

	const { user } = useAuth();

	// 신청 폼
	const [employees, setEmployees] = useState<SelectableEmployee[]>([]);
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
		// 고를 수 있는 범위는 서버가 역할에 따라 정한다 (관리자 전체 / 인사팀 관리자 제외 / 일반 본인만)
		listSelectableEmployees()
			.then((list) => {
				setEmployees(list);
				// 본인이 후보에 있으면 미리 선택해 둔다 — 일반 직원은 어차피 본인뿐이다
				const me = list.find((e) => e.self);
				if (me) setForm((f) => (f.employeeId ? f : { ...f, employeeId: String(me.id) }));
			})
			.catch(() => setEmployees([]));
	}, []);

	const filtered = type ? rows.filter((d) => d.eventType === type) : rows;

	function set(k: string, v: string) {
		setForm((f) => ({ ...f, [k]: v }));
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.employeeId || !form.targetName.trim() || !form.requestedAmount) {
			notify("교직원·대상자·신청금액을 입력하세요.", "error");
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
			notify(err instanceof ApiError ? err.message : "경조비 신청에 실패했습니다.", "error");
		} finally {
			setSaving(false);
		}
	}

	const getStatusPill = (status?: string) => {
		if (status === "APPROVED") return <span className="pill green">승인됨</span>;
		if (status === "REJECTED") return <span className="pill red">반려됨</span>;
		if (status === "PENDING") return <span className="pill amber">결재대기</span>;
		return <span className="pill gray">{status || "대기"}</span>;
	};

	async function handleApprove(d: EventSupport) {
		if (!(await askConfirm({ title: "경조비 승인", message: `${d.targetName}님의 ${d.eventType} 경조비를 승인합니다.`, confirmLabel: "승인" }))) return;
		try {
			await approveEventSupport(d.id);
			reload();
		} catch (err) {
			notify(err instanceof ApiError ? err.message : "승인 처리에 실패했습니다.", "error");
		}
	}

	async function handleReject(d: EventSupport) {
		const memo = await askPrompt({
			title: "경조비 반려",
			message: `${d.targetName}님의 ${d.eventType} 경조비를 반려합니다.`,
			label: "반려 사유 (선택)",
			placeholder: "예: 증빙 서류 미제출",
			confirmLabel: "반려",
			danger: true,
		});
		if (memo === null) return;
		try {
			await rejectEventSupport(d.id, memo || undefined);
			reload();
		} catch (err) {
			notify(err instanceof ApiError ? err.message : "반려 처리에 실패했습니다.", "error");
		}
	}

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">경조비 신청 내역</div>
					<div className="page-sub">직원 본인 및 가족의 경조사 지원금을 신청하고 결재 상태를 관리합니다</div>
				</div>
				<button onClick={() => setShowForm(true)} className="btn-primary">+ 경조비 신규 신청</button>
			</div>

			<div className="bg-white rounded-2xl border border-slate-100 mb-5 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<span className="text-[13px] font-bold text-slate-700 whitespace-nowrap">경조 구분 검색</span>
					<select value={type} onChange={(e) => setType(e.target.value)} className="filter-select flex-1 sm:flex-none">
						<option value="">전체 내역</option>
						<option value="결혼">결혼</option>
						<option value="출산">출산</option>
						<option value="사망">사망</option>
						<option value="기타">기타</option>
					</select>
				</div>
				<div className="text-[12.5px] text-slate-400 sm:ml-auto text-right sm:text-left">
					총 <span className="font-extrabold text-indigo-700">{filtered.length}</span>건의 신청 내역
				</div>
			</div>

			<div className="card">
				<div className="overflow-x-auto">
					<table className="w-full whitespace-nowrap min-w-[600px] hidden lg:table">
						<thead>
							<tr>
								<th>신청번호</th>
								<th>경조구분</th>
								<th>대상자</th>
								<th style={{textAlign: "right"}}>신청금액</th>
								<th>경조일자</th>
								<th style={{textAlign: "center"}}>결재상태</th>
								<th style={{textAlign: "right"}}>결재 관리</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr className="empty-row"><td colSpan={7}>데이터를 불러오는 중입니다...</td></tr>
							) : filtered.length === 0 ? (
								<tr className="empty-row"><td colSpan={7}>조회된 경조비 신청 내역이 없습니다.</td></tr>
							) : (
								filtered.map((d) => (
									<tr key={d.id}>
										<td className="mono" style={{color:"#8A94A6", fontSize:"13px"}}>{d.documentNumber}</td>
										<td style={{fontWeight: 700, color: "#111827"}}>{d.eventType}</td>
										<td style={{color: "#4B5565"}}>{d.targetName}</td>
										<td className="mono" style={{textAlign: "right", fontWeight: "bold"}}>{d.requestedAmount?.toLocaleString()}원</td>
										<td className="mono">{d.eventDate}</td>
										<td style={{textAlign: "center"}}>
											{getStatusPill(d.approvalStatus)}
										</td>
										<td style={{textAlign: "right"}}>
											{d.approvalStatus === "PENDING" && canApproveTarget(user, d.employeeId, d.departmentId, d.positionLevel) ? (
												<>
													<button className="btn-primary" style={{display: "inline-flex", marginRight: "6px"}} onClick={() => handleApprove(d)}>승인</button>
													<button className="btn-ghost" style={{display: "inline-flex", color: "#DC2626", borderColor: "#FECACA"}} onClick={() => handleReject(d)}>반려</button>
												</>
											) : d.approvalStatus === "APPROVED" ? (
												<span style={{fontSize: "12.5px", color: "#10B981"}}>승인됨</span>
											) : d.approvalStatus === "REJECTED" ? (
												<span style={{fontSize: "12.5px", color: "#9AA3B2"}}>반려됨</span>
											) : null}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>

					{/* Mobile Card View */}
					<div className="lg:hidden flex flex-col gap-4 p-4 bg-slate-50/50">
						{loading ? (
							<div className="text-center text-slate-400 py-8 text-sm">데이터를 불러오는 중입니다...</div>
						) : filtered.length === 0 ? (
							<div className="text-center text-slate-400 py-8 text-sm">조회된 내역이 없습니다.</div>
						) : (
							filtered.map(d => (
								<div key={d.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
									<div className="flex justify-between items-start border-b border-slate-100 pb-3">
										<div className="flex flex-col">
											<span className="text-[11px] font-mono text-slate-400">{d.documentNumber}</span>
											<span className="font-bold text-slate-900 mt-1 flex items-center gap-2">
												{d.eventType} 
												<span className="text-slate-400 font-normal text-sm">|</span>
												<span className="text-slate-600 font-medium text-sm">{d.targetName}</span>
											</span>
										</div>
										<div className="scale-90 origin-top-right">{getStatusPill(d.approvalStatus)}</div>
									</div>
									
									<div className="flex justify-between items-center text-sm">
										<span className="text-slate-500 font-medium">경조일자</span>
										<span className="font-mono text-slate-700">{d.eventDate}</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-slate-500 font-medium">신청금액</span>
										<span className="font-bold text-indigo-700">{d.requestedAmount?.toLocaleString()}원</span>
									</div>
									
									<div className="mt-2 pt-3 border-t border-slate-50 flex justify-end gap-2">
										{d.approvalStatus === "PENDING" && canApproveTarget(user, d.employeeId, d.departmentId, d.positionLevel) ? (
											<>
												<button className="btn-primary py-1.5 px-4 text-xs h-auto" onClick={() => handleApprove(d)}>승인</button>
												<button className="btn-ghost py-1.5 px-4 text-xs h-auto text-red-600 border-red-200" onClick={() => handleReject(d)}>반려</button>
											</>
										) : d.approvalStatus === "APPROVED" ? (
											<span className="text-[12.5px] font-bold text-emerald-500">결재 승인됨</span>
										) : d.approvalStatus === "REJECTED" ? (
											<span className="text-[12.5px] font-bold text-slate-400">결재 반려됨</span>
										) : null}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{showForm && (
				<div className="modal-overlay">
					<div className="modal">
						<div className="modal-head">
							<div className="modal-title">경조비 신규 신청</div>
							<button type="button" onClick={() => setShowForm(false)} className="modal-x">&times;</button>
						</div>
						<div className="modal-body">
							<form onSubmit={submit}>
								<div className="form-grid">
									<div className="form-field full">
										<label>신청 교직원 <span className="req">*</span></label>
										<select value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} required>
											<option value="">교직원 선택</option>
											{employees.map((emp) => (
											<option key={emp.id} value={emp.id}>
												{emp.self ? `${emp.name} (본인)` : emp.name} · {emp.departmentName ?? "-"} {emp.positionName ?? ""}
											</option>
										))}
										</select>
									</div>
									<div className="form-field">
										<label>경조 구분 <span className="req">*</span></label>
										<select value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
											<option value="결혼">결혼</option><option value="출산">출산</option><option value="사망">사망</option><option value="기타">기타</option>
										</select>
									</div>
									<div className="form-field">
										<label>가족 관계</label>
										<input value={form.familyRelation} onChange={(e) => set("familyRelation", e.target.value)} placeholder="본인/배우자 등" />
									</div>
									<div className="form-field full">
										<label>대상자 성명 <span className="req">*</span></label>
										<input value={form.targetName} onChange={(e) => set("targetName", e.target.value)} required />
									</div>
									<div className="form-field">
										<label>신청일자 <span className="req">*</span></label>
										<input type="date" value={form.applicationDate} onChange={(e) => set("applicationDate", e.target.value)} required />
									</div>
									<div className="form-field">
										<label>실제 경조일 <span className="req">*</span></label>
										<input type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} required />
									</div>
									<div className="form-field">
										<label>신청 금액 (원) <span className="req">*</span></label>
										<input type="number" min="0" value={form.requestedAmount} onChange={(e) => set("requestedAmount", e.target.value)} required />
									</div>
									<div className="form-field">
										<label>장소 (선택)</label>
										<input value={form.eventLocation} onChange={(e) => set("eventLocation", e.target.value)} placeholder="식장 등 기입" />
									</div>
								</div>
								
								<div className="modal-foot" style={{marginTop: "20px"}}>
									<button type="button" onClick={() => setShowForm(false)} className="btn-ghost">취소</button>
									<button type="submit" disabled={saving} className="btn-primary">
										{saving ? "처리 중..." : "신청 완료"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
