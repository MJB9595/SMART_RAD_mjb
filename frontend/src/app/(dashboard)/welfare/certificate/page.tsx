"use client";

import { useEffect, useState } from "react";
import {
	listCertificates,
	createCertificate,
	approveCertificate,
	rejectCertificate,
	type Certificate,
} from "@/lib/api/welfare";
import { searchEmployees } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";
import type { Employee } from "@/lib/types/employee";
import { CertificatePrintModal } from "@/components/CertificatePrintModal";
import { useAuth } from "@/lib/auth/AuthContext";
import { canApproveTarget } from "@/lib/auth/permissions";
import { useFeedback } from "@/components/feedback/FeedbackProvider";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function CertificatePage() {
	const { notify, confirm: askConfirm, prompt: askPrompt } = useFeedback();
	const [type, setType] = useState("");
	const [rows, setRows] = useState<Certificate[]>([]);
	const [loading, setLoading] = useState(true);

	const { user } = useAuth();

	const [employees, setEmployees] = useState<Employee[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState({ employeeId: "", certificateType: "재직증명서", applicationDate: today(), purpose: "" });
	const [saving, setSaving] = useState(false);
	// 발급 완료된 증명서 서식 미리보기/인쇄 대상
	const [printTarget, setPrintTarget] = useState<Certificate | null>(null);

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

	/** 발급 처리 — 승인 시 발급완료(ISSUED) 상태가 되어 증명서를 출력할 수 있다. */
	async function handleIssue(cert: Certificate) {
		if (!(await askConfirm({ title: "증명서 발급", message: `${cert.employeeName} 님의 ${cert.certificateType}를 발급 처리합니다.`, confirmLabel: "발급" }))) return;
		try {
			await approveCertificate(cert.id);
			reload();
		} catch (err) {
			notify(err instanceof ApiError ? err.message : "발급 처리에 실패했습니다.", "error");
		}
	}

	/** 발급 반려 */
	async function handleReject(cert: Certificate) {
		const memo = await askPrompt({
			title: "증명서 반려",
			message: `${cert.employeeName} 님의 ${cert.certificateType} 발급을 반려합니다.`,
			label: "반려 사유 (선택)",
			placeholder: "예: 제출 서류 미비",
			confirmLabel: "반려",
			danger: true,
		});
		if (memo === null) return;
		try {
			await rejectCertificate(cert.id, memo || undefined);
			reload();
		} catch (err) {
			notify(err instanceof ApiError ? err.message : "반려 처리에 실패했습니다.", "error");
		}
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.employeeId) {
			notify("신청 교직원을 선택하세요.", "error");
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
			notify(err instanceof ApiError ? err.message : "증명서 신청에 실패했습니다.", "error");
		} finally {
			setSaving(false);
		}
	}

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">제증명 발급 신청</div>
					<div className="page-sub">재직, 경력, 원천징수 등 필요 증명서를 즉시 신청하고 다운로드 받으세요</div>
				</div>
				<button onClick={() => setShowForm(true)} className="btn-primary">+ 신규 증명서 발급</button>
			</div>

			<div className="bg-white rounded-2xl border border-slate-100 mb-5 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<span className="text-[13px] font-bold text-slate-700 whitespace-nowrap">증명서 구분 검색</span>
					<select value={type} onChange={(e) => setType(e.target.value)} className="filter-select flex-1 sm:flex-none">
						<option value="">모든 증명서 내역</option>
						<option value="재직증명서">재직증명서</option>
						<option value="경력증명서">경력증명서</option>
						<option value="원천징수영수증">원천징수영수증</option>
					</select>
				</div>
				<div className="text-[12.5px] text-slate-400 sm:ml-auto text-right sm:text-left">
					조회된 내역 <span className="font-extrabold text-indigo-700">{filtered.length}</span>건
				</div>
			</div>

			<div className="card">
				<div className="overflow-x-auto">
					<table className="w-full whitespace-nowrap min-w-[600px] hidden lg:table">
						<thead>
							<tr>
								<th>신청번호</th>
								<th>대상자</th>
								<th>증명서 종류</th>
								<th>신청 사유(용도)</th>
								<th>신청일자</th>
								<th style={{textAlign: "center"}}>발급상태</th>
								<th style={{textAlign: "right"}}>발급 관리</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr className="empty-row"><td colSpan={7}>데이터를 불러오는 중입니다...</td></tr>
							) : filtered.length === 0 ? (
								<tr className="empty-row"><td colSpan={7}>증명서 발급 신청 내역이 없습니다.</td></tr>
							) : (
								filtered.map((d) => (
									<tr key={d.id}>
										<td className="mono" style={{color:"#8A94A6", fontSize:"13px"}}>{d.documentNumber}</td>
										<td>
											<div className="p-name">{d.employeeName}</div>
											<div className="p-sub mono">{d.employeeNumber}</div>
										</td>
										<td style={{fontWeight: 700, color: "#111827"}}>{d.certificateType}</td>
										<td style={{color: "#4B5565"}}>{d.purpose || "-"}</td>
										<td className="mono">{d.applicationDate}</td>
										<td style={{textAlign: "center"}}>
											{d.issueStatus === "ISSUED" ? (
												<span className="pill blue">발급완료</span>
											) : d.issueStatus === "REJECTED" ? (
												<span className="pill red">반려</span>
											) : (
												<span className="pill amber">발급대기</span>
											)}
										</td>
										<td style={{textAlign: "right"}}>
											{d.issueStatus === "ISSUED" ? (
													<button className="btn-ghost" style={{display: "inline-flex"}} onClick={() => setPrintTarget(d)}>증명서 보기 / 인쇄</button>
												) : d.issueStatus === "REJECTED" ? (
													<span style={{fontSize: "12.5px", color: "#9AA3B2"}}>반려됨</span>
												) : canApproveTarget(user, d.employeeId, d.departmentId, d.positionLevel) ? (
													<>
														<button className="btn-primary" style={{display: "inline-flex", marginRight: "6px"}} onClick={() => handleIssue(d)}>발급 처리</button>
														<button className="btn-ghost" style={{display: "inline-flex", color: "#DC2626", borderColor: "#FECACA"}} onClick={() => handleReject(d)}>반려</button>
													</>
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
							<div className="text-center text-slate-400 py-8 text-sm">증명서 발급 신청 내역이 없습니다.</div>
						) : (
							filtered.map(d => (
								<div key={d.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
									<div className="flex justify-between items-start border-b border-slate-100 pb-3">
										<div className="flex flex-col">
											<span className="text-[11px] font-mono text-slate-400">{d.documentNumber}</span>
											<span className="font-bold text-slate-900 mt-1 flex items-center gap-2">
												{d.certificateType}
												<span className="text-slate-400 font-normal text-sm">|</span>
												<span className="text-slate-600 font-medium text-sm">{d.employeeName}</span>
											</span>
										</div>
										<div className="scale-90 origin-top-right">
											{d.issueStatus === "ISSUED" ? (
												<span className="pill blue">발급완료</span>
											) : d.issueStatus === "REJECTED" ? (
												<span className="pill red">반려</span>
											) : (
												<span className="pill amber">발급대기</span>
											)}
										</div>
									</div>
									
									<div className="flex justify-between items-center text-sm">
										<span className="text-slate-500 font-medium">신청일자</span>
										<span className="font-mono text-slate-700">{d.applicationDate}</span>
									</div>
									<div className="flex flex-col gap-1 text-sm bg-slate-50 rounded-lg p-2.5">
										<span className="text-slate-500 font-medium text-xs">신청 사유(용도)</span>
										<span className="text-slate-700">{d.purpose || "-"}</span>
									</div>
									
									<div className="mt-2 pt-3 border-t border-slate-50 flex justify-end gap-2">
										{d.issueStatus === "ISSUED" ? (
											<button className="btn-ghost py-1.5 px-4 text-xs h-auto" onClick={() => setPrintTarget(d)}>증명서 보기 / 인쇄</button>
										) : d.issueStatus === "REJECTED" ? (
											<span className="text-[12.5px] font-bold text-slate-400">결재 반려됨</span>
										) : canApproveTarget(user, d.employeeId, d.departmentId, d.positionLevel) ? (
											<>
												<button className="btn-primary py-1.5 px-4 text-xs h-auto" onClick={() => handleIssue(d)}>발급 처리</button>
												<button className="btn-ghost py-1.5 px-4 text-xs h-auto text-red-600 border-red-200" onClick={() => handleReject(d)}>반려</button>
											</>
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
							<div className="modal-title">제증명 발급 신청</div>
							<button type="button" onClick={() => setShowForm(false)} className="modal-x">&times;</button>
						</div>
						<div className="modal-body">
							<form onSubmit={submit}>
								<div className="form-grid">
									<div className="form-field full">
										<label>신청 교직원 <span className="req">*</span></label>
										<select value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} required>
											<option value="">교직원 선택</option>
											{employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeNumber})</option>))}
										</select>
									</div>
									<div className="form-field full">
										<label>증명서 종류 <span className="req">*</span></label>
										<select value={form.certificateType} onChange={(e) => set("certificateType", e.target.value)}>
											<option value="재직증명서">재직증명서</option>
											<option value="경력증명서">경력증명서</option>
											<option value="원천징수영수증">원천징수영수증</option>
										</select>
									</div>
									<div className="form-field">
										<label>신청일자 <span className="req">*</span></label>
										<input type="date" value={form.applicationDate} onChange={(e) => set("applicationDate", e.target.value)} required />
									</div>
									<div className="form-field full">
										<label>신청 사유 (용도)</label>
										<input value={form.purpose} onChange={(e) => set("purpose", e.target.value)} placeholder="예: 은행 대출 서류 제출용" />
									</div>
								</div>
								<div className="modal-foot" style={{marginTop: "20px"}}>
									<button type="button" onClick={() => setShowForm(false)} className="btn-ghost">취소</button>
									<button type="submit" disabled={saving} className="btn-primary">
										{saving ? "신청 중..." : "발급 신청"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
			{printTarget && (
				<CertificatePrintModal cert={printTarget} onClose={() => setPrintTarget(null)} />
			)}
		</>
	);
}
