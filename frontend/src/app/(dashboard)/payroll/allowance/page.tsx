"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { listAllowances, createAllowance, updateAllowance, setAllowanceActive, deleteAllowance, type Allowance } from "@/lib/api/allowance";
import { ApiError } from "@/lib/api/client";
import { useFeedback } from "@/components/feedback/FeedbackProvider";

export default function AllowancePage() {
	const { notify, confirm: askConfirm } = useFeedback();
	const [allowances, setAllowances] = useState<Allowance[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);

	const [name, setName] = useState("");
	const [taxable, setTaxable] = useState(true);
	const [fixed, setFixed] = useState(true);
	const [saving, setSaving] = useState(false);
	/** 수정 중인 수당. null 이면 신규 등록. */
	const [editing, setEditing] = useState<Allowance | null>(null);

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

	function openCreate() {
		setEditing(null);
		setName("");
		setTaxable(true);
		setFixed(true);
		setShowForm(true);
	}

	function openEdit(a: Allowance) {
		setEditing(a);
		setName(a.name);
		setTaxable(a.taxable);
		setFixed(a.fixed);
		setShowForm(true);
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			const body = { name: name.trim(), taxable, fixed };
			if (editing) {
				await updateAllowance(editing.id, body);
			} else {
				await createAllowance(body);
			}
			setShowForm(false);
			setEditing(null);
			reload();
		} catch (err) {
			notify(err instanceof ApiError ? err.message : "수당 저장에 실패했습니다.", "error");
		} finally {
			setSaving(false);
		}
	}

	async function toggleActive(a: Allowance) {
		try {
			await setAllowanceActive(a.id, !a.active);
			reload();
		} catch (err) {
			notify(err instanceof ApiError ? err.message : "상태 변경에 실패했습니다.", "error");
		}
	}

	async function remove(a: Allowance) {
		const ok = await askConfirm({
			title: "수당 삭제",
			message: `'${a.name}' 수당을 삭제합니다.\n지급받는 교직원이 있으면 삭제되지 않습니다.`,
			confirmLabel: "삭제",
			danger: true,
		});
		if (!ok) return;
		try {
			await deleteAllowance(a.id);
			reload();
		} catch (err) {
			notify(err instanceof ApiError ? err.message : "삭제에 실패했습니다.", "error");
		}
	}

	return (
		<>
			<div className="title-row flex-col sm:flex-row gap-4 sm:gap-0">
				<div>
					<div className="page-title">수당 관리</div>
					<div className="page-sub">급여에 적용되는 고정 및 변동 수당 항목을 손쉽게 설정하세요</div>
				</div>
				<button onClick={openCreate} className="btn-primary w-full sm:w-auto">+ 신규 수당 등록</button>
			</div>

			<div className="card">
				<div className="card-head">
					<div className="card-title">등록된 수당 목록</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full whitespace-nowrap min-w-[600px] hidden lg:table">
						<thead>
							<tr>
								<th>수당 ID</th>
								<th>수당명</th>
								<th style={{textAlign:"center"}}>과세 여부</th>
								<th style={{textAlign:"center"}}>지급 형태</th>
								<th style={{textAlign:"center"}}>사용 여부</th>
								<th style={{textAlign:"right"}}>관리</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr className="empty-row"><td colSpan={6}>데이터를 불러오는 중입니다...</td></tr>
							) : allowances.length === 0 ? (
								<tr className="empty-row"><td colSpan={6}>등록된 수당 내역이 없습니다.</td></tr>
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
										<td style={{textAlign:"center"}}>
											<span className={`pill ${a.active ? "blue" : "gray"}`}>{a.active ? "사용" : "미사용"}</span>
										</td>
										<td>
											<div className="row-actions" style={{justifyContent:"flex-end"}}>
												<button className="btn-ghost" onClick={() => openEdit(a)}>수정</button>
												<button className="btn-ghost" onClick={() => toggleActive(a)}>
													{a.active ? "미사용" : "사용"}
												</button>
												<button className="btn-ghost" style={{color:"#DC2626", borderColor:"#FECACA"}} onClick={() => remove(a)}>
													삭제
												</button>
											</div>
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
						) : allowances.length === 0 ? (
							<div className="text-center text-slate-400 py-8 text-sm">등록된 수당 내역이 없습니다.</div>
						) : (
							allowances.map((a) => (
								<div key={a.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
									<div className="flex justify-between items-start border-b border-slate-100 pb-3">
										<div className="flex flex-col gap-1">
											<span className="text-[11px] font-mono text-slate-400">A{String(a.id).padStart(3, "0")}</span>
											<div className="font-bold text-slate-900 flex items-center gap-2">
												{a.name}
											</div>
										</div>
										<div className="scale-90 origin-top-right">
											<span className={`pill ${a.active ? "blue" : "gray"}`}>{a.active ? "사용" : "미사용"}</span>
										</div>
									</div>
									<div className="flex justify-between items-center text-sm pt-1">
										<span className="text-slate-500 font-medium">과세 여부</span>
										{a.taxable ? <span className="pill red">과세</span> : <span className="pill blue">비과세</span>}
									</div>
									<div className="flex justify-between items-center text-sm pb-1">
										<span className="text-slate-500 font-medium">지급 형태</span>
										{a.fixed ? <span className="pill gray">매월 고정액</span> : <span className="pill green">변동 지급</span>}
									</div>
									<div className="pt-3 border-t border-slate-50 flex flex-wrap gap-2 justify-end">
										<button className="btn-ghost py-1.5 px-4 text-xs h-auto" onClick={() => openEdit(a)}>수정</button>
										<button className="btn-ghost py-1.5 px-4 text-xs h-auto" onClick={() => toggleActive(a)}>
											{a.active ? "미사용" : "사용"}
										</button>
										<button className="btn-ghost py-1.5 px-4 text-xs h-auto text-red-600 border-red-200" onClick={() => remove(a)}>
											삭제
										</button>
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
							<div className="modal-title">{editing ? "수당 수정" : "신규 수당 등록"}</div>
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
										{saving ? "처리 중..." : editing ? "변경 저장" : "등록 완료"}
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
