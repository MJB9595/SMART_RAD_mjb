"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { listAllowances, createAllowance, type Allowance } from "@/lib/api/allowance";
import { ApiError } from "@/lib/api/client";

export default function AllowancePage() {
	const [allowances, setAllowances] = useState<Allowance[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);

	const [name, setName] = useState("");
	const [taxable, setTaxable] = useState(true);
	const [fixed, setFixed] = useState(true);
	const [saving, setSaving] = useState(false);

	function reload() {
		setLoading(true);
		listAllowances()
			.then(setAllowances)
			.catch(() => setAllowances([]))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		reload();
	}, []);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			await createAllowance({ name: name.trim(), taxable, fixed });
			setShowForm(false);
			setName("");
			setTaxable(true);
			setFixed(true);
			reload();
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "수당 등록에 실패했습니다.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">수당 관리</div>
					<div className="page-sub">급여에 적용되는 고정 및 변동 수당 항목을 손쉽게 설정하세요</div>
				</div>
				<button onClick={() => setShowForm(true)} className="btn-primary">+ 신규 수당 등록</button>
			</div>

			<div className="card">
				<div className="card-head">
					<div className="card-title">등록된 수당 목록</div>
				</div>
				<div className="overflow-x-auto">
					<table>
						<thead>
							<tr>
								<th>수당 ID</th>
								<th>수당명</th>
								<th style={{textAlign:"center"}}>과세 여부</th>
								<th style={{textAlign:"center"}}>지급 형태</th>
								<th style={{textAlign:"right"}}>관리</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr className="empty-row"><td colSpan={5}>데이터를 불러오는 중입니다...</td></tr>
							) : allowances.length === 0 ? (
								<tr className="empty-row"><td colSpan={5}>등록된 수당 내역이 없습니다.</td></tr>
							) : (
								allowances.map((a) => (
									<tr key={a.id}>
										<td className="mono" style={{color:"#8A94A6", fontSize:"13px"}}>A{String(a.id).padStart(3, "0")}</td>
										<td className="p-name">{a.name}</td>
										<td style={{textAlign:"center"}}>
											{a.taxable ? (
												<span className="pill red">과세</span>
											) : (
												<span className="pill blue">비과세</span>
											)}
										</td>
										<td style={{textAlign:"center"}}>
											{a.fixed ? (
												<span className="pill gray">매월 고정액</span>
											) : (
												<span className="pill green">변동 지급</span>
											)}
										</td>
										<td style={{textAlign:"right"}}>
											<button className="btn-sm">수정</button>
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
							<div className="modal-title">신규 수당 등록</div>
							<button type="button" onClick={() => setShowForm(false)} className="modal-x">&times;</button>
						</div>
						<div className="modal-body">
							<form onSubmit={submit}>
								<div className="form-field mb-4">
									<label>수당명 <span className="req">*</span></label>
									<input
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="예: 직책수당, 가족수당"
										required
									/>
								</div>
								
								<div style={{background:"#F7F8FA", padding:"16px", borderRadius:"12px", border:"1px solid #EEF0F3", display:"flex", flexDirection:"column", gap:"12px"}}>
									<label className="form-check" style={{alignItems: "flex-start"}}>
										<input type="checkbox" checked={taxable} onChange={(e) => setTaxable(e.target.checked)} style={{marginTop:"3px"}} />
										<div>
											<div style={{fontWeight:700, color:"#111827", marginBottom:"2px"}}>과세 대상 포함</div>
											<div style={{fontSize:"11.5px", color:"#8A94A6"}}>소득세 부과 대상 수당 여부</div>
										</div>
									</label>
									
									<label className="form-check" style={{alignItems: "flex-start"}}>
										<input type="checkbox" checked={fixed} onChange={(e) => setFixed(e.target.checked)} style={{marginTop:"3px"}} />
										<div>
											<div style={{fontWeight:700, color:"#111827", marginBottom:"2px"}}>고정 수당</div>
											<div style={{fontSize:"11.5px", color:"#8A94A6"}}>매월 고정 금액이 지급되는 수당</div>
										</div>
									</label>
								</div>
								
								<div className="modal-foot" style={{marginTop:"24px", padding:"0", borderTop:"none"}}>
									<button type="button" onClick={() => setShowForm(false)} className="btn-ghost">취소</button>
									<button type="submit" disabled={saving} className="btn-primary">
										{saving ? "처리 중..." : "등록 완료"}
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
