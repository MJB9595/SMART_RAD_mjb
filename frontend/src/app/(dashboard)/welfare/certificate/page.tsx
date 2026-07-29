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

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function CertificatePage() {
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
		if (!confirm(`${cert.employeeName} 님의 ${cert.certificateType}를 발급 처리하시겠습니까?`)) return;
		try {
			await approveCertificate(cert.id);
			reload();
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "발급 처리에 실패했습니다.");
		}
	}

	/** 발급 반려 */
	async function handleReject(cert: Certificate) {
		const memo = prompt("반려 사유를 입력하세요 (선택)");
		if (memo === null) return;
		try {
			await rejectCertificate(cert.id, memo || undefined);
			reload();
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "반려 처리에 실패했습니다.");
		}
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
		<>
			<div className="title-row">
				<div>
					<div className="page-title">제증명 발급 신청</div>
					<div className="page-sub">재직, 경력, 원천징수 등 필요 증명서를 즉시 신청하고 다운로드 받으세요</div>
				</div>
				<button onClick={() => setShowForm(true)} className="btn-primary">+ 신규 증명서 발급</button>
			</div>

			<div className="filter-bar" style={{background: "#fff", borderRadius: "14px", border: "1px solid #EEF0F3", marginBottom: "20px"}}>
				<span style={{fontSize: "13px", fontWeight: 700, color: "#374151"}}>증명서 종류</span>
				<select value={type} onChange={(e) => setType(e.target.value)} className="filter-select">
					<option value="">모든 증명서 내역</option>
					<option value="재직증명서">재직증명서</option>
					<option value="경력증명서">경력증명서</option>
					<option value="원천징수영수증">원천징수영수증</option>
				</select>
				<div style={{marginLeft: "auto", fontSize: "12.5px", color: "#8A94A6"}}>
					조회된 내역 <span style={{fontWeight: 800, color: "#1F3A8F"}}>{filtered.length}</span>건
				</div>
			</div>

			<div className="card">
				<div className="overflow-x-auto">
					<table>
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
