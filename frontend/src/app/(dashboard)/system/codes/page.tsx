"use client";

import { useEffect, useMemo, useState } from "react";
import { listCommonCodes, createCommonCode, updateCommonCode, deleteCommonCode } from "@/lib/api/system";
import { ApiError } from "@/lib/api/client";
import type { CommonCode } from "@/lib/types/system";
import { Plus, Pencil, Trash2, XCircle } from "lucide-react";

type FormState = { id: number | null; groupCode: string; code: string; name: string; sortOrder: string; parentCode: string };
const EMPTY_FORM: FormState = { id: null, groupCode: "", code: "", name: "", sortOrder: "1", parentCode: "" };

export default function CodesPage() {
	const [codes, setCodes] = useState<CommonCode[]>([]);
	const [group, setGroup] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [notice, setNotice] = useState<string | null>(null);
	const [form, setForm] = useState<FormState | null>(null);
	const [saving, setSaving] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<CommonCode | null>(null);

	const messageOf = (err: unknown, fallback: string) => (err instanceof ApiError ? err.message : fallback);

	function reload() {
		return listCommonCodes()
			.then(setCodes)
			.catch((err) => setError(messageOf(err, "공통코드를 불러오지 못했습니다.")));
	}

	useEffect(() => {
		reload().finally(() => setLoading(false));
	}, []);

	const groups = useMemo(() => [...new Set(codes.map((c) => c.groupCode))], [codes]);
	const filtered = useMemo(() => codes.filter((c) => !group || c.groupCode === group), [codes, group]);

	function openCreate() {
		// 그룹을 선택해 둔 상태라면 그 그룹으로 미리 채워 준다 (같은 그룹에 여러 건 넣는 게 대부분이라)
		setForm({ ...EMPTY_FORM, groupCode: group });
	}

	function openEdit(c: CommonCode) {
		setForm({
			id: c.id,
			groupCode: c.groupCode,
			code: c.code,
			name: c.name,
			sortOrder: String(c.sortOrder),
			parentCode: c.parentCode ?? "",
		});
	}

	async function submitForm(e: React.FormEvent) {
		e.preventDefault();
		if (!form) return;
		setSaving(true);
		setNotice(null);
		try {
			const body = {
				groupCode: form.groupCode.trim().toUpperCase(),
				code: form.code.trim().toUpperCase(),
				name: form.name.trim(),
				sortOrder: Number(form.sortOrder) || 0,
				parentCode: form.parentCode.trim() || null,
			};
			if (form.id === null) {
				await createCommonCode(body);
			} else {
				await updateCommonCode(form.id, body);
			}
			setForm(null);
			await reload();
		} catch (err) {
			setNotice(messageOf(err, "저장에 실패했습니다."));
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(c: CommonCode) {
		setPendingDelete(null);
		setNotice(null);
		try {
			await deleteCommonCode(c.id);
			await reload();
		} catch (err) {
			setNotice(messageOf(err, "삭제에 실패했습니다."));
		}
	}

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">공통 코드 관리</div>
					<div className="page-sub">휴가유형·발령유형 등 시스템 공통 코드를 관리합니다.</div>
				</div>
				<button className="btn-primary" onClick={openCreate}>
					<Plus className="w-4 h-4" /> 코드 등록
				</button>
			</div>

			{notice && (
				<div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
					<XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
					<div className="flex-1 text-[13px] font-semibold text-rose-800">{notice}</div>
					<button type="button" onClick={() => setNotice(null)} className="text-rose-400 hover:text-rose-600 text-[15px] leading-none">
						&times;
					</button>
				</div>
			)}

			<div className="filter-bar" style={{ background: "#fff", borderRadius: "14px", border: "1px solid #EEF0F3", marginBottom: "20px" }}>
				<span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>코드그룹</span>
				<select value={group} onChange={(e) => setGroup(e.target.value)} className="filter-select">
					<option value="">전체 그룹</option>
					{groups.map((g) => (
						<option key={g} value={g}>{g}</option>
					))}
				</select>
				<div style={{ marginLeft: "auto", fontSize: "12.5px", color: "#8A94A6" }}>
					조회된 코드 <span style={{ fontWeight: 800, color: "#1F3A8F" }}>{filtered.length}</span>건
				</div>
			</div>

			<div className="card">
				<div className="overflow-x-auto">
					<table>
						<thead>
							<tr>
								<th>코드그룹</th>
								<th>코드</th>
								<th>코드명</th>
								<th>정렬순서</th>
								<th>상위코드</th>
								<th style={{ textAlign: "center" }}>상태</th>
								<th style={{ textAlign: "right" }}>관리</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr className="empty-row"><td colSpan={7}>데이터를 불러오는 중입니다...</td></tr>
							) : error ? (
								<tr className="empty-row"><td colSpan={7}>{error}</td></tr>
							) : filtered.length === 0 ? (
								<tr className="empty-row"><td colSpan={7}>등록된 공통코드가 없습니다.</td></tr>
							) : (
								filtered.map((c) => (
									<tr key={c.id}>
										<td className="mono" style={{ color: "#8A94A6" }}>{c.groupCode}</td>
										<td className="mono" style={{ fontWeight: 700 }}>{c.code}</td>
										<td>{c.name}</td>
										<td>{c.sortOrder}</td>
										<td className="mono" style={{ color: "#B0B7C3" }}>{c.parentCode || "-"}</td>
										<td style={{ textAlign: "center" }}>
											<span className={`pill ${c.active ? "blue" : "gray"}`}>{c.active ? "활성" : "비활성"}</span>
										</td>
										<td>
											<div className="row-actions" style={{ justifyContent: "flex-end" }}>
												<button className="btn-ghost" onClick={() => openEdit(c)}>
													<Pencil className="w-3.5 h-3.5" /> 수정
												</button>
												<button className="btn-ghost" style={{ color: "#DC2626", borderColor: "#FECACA" }} onClick={() => setPendingDelete(c)}>
													<Trash2 className="w-3.5 h-3.5" /> 삭제
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* 삭제 확인 */}
			{pendingDelete && (
				<div className="modal-overlay">
					<div className="modal" style={{ maxWidth: "420px" }}>
						<div className="modal-head">
							<div className="modal-title">공통코드 삭제</div>
							<button type="button" onClick={() => setPendingDelete(null)} className="modal-x">&times;</button>
						</div>
						<div className="modal-body">
							<p className="text-[13.5px] text-slate-700 leading-relaxed">
								<b>{pendingDelete.name}</b> (<span className="font-mono">{pendingDelete.groupCode}/{pendingDelete.code}</span>) 코드를 삭제합니다.
								<br />이 코드를 참조하는 기존 데이터의 표시가 달라질 수 있습니다.
							</p>
							<div className="modal-foot" style={{ marginTop: "20px" }}>
								<button type="button" onClick={() => setPendingDelete(null)} className="btn-ghost">취소</button>
								<button type="button" onClick={() => handleDelete(pendingDelete)} className="btn-primary" style={{ background: "#DC2626" }}>
									삭제
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* 등록/수정 모달 */}
			{form && (
				<div className="modal-overlay">
					<div className="modal">
						<div className="modal-head">
							<div className="modal-title">{form.id === null ? "코드 등록" : "코드 수정"}</div>
							<button type="button" onClick={() => setForm(null)} className="modal-x">&times;</button>
						</div>
						<div className="modal-body">
							<form onSubmit={submitForm}>
								<div className="form-grid">
									<div className="form-field">
										<label>코드그룹 <span className="req">*</span></label>
										<input
											value={form.groupCode}
											onChange={(e) => setForm({ ...form, groupCode: e.target.value.toUpperCase() })}
											placeholder="LEAVE_TYPE"
											disabled={form.id !== null}
											required
										/>
									</div>
									<div className="form-field">
										<label>코드 <span className="req">*</span></label>
										<input
											value={form.code}
											onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
											placeholder="ANNUAL"
											disabled={form.id !== null}
											required
										/>
									</div>
									{form.id !== null && (
										<div className="form-field full">
											<span className="text-[11.5px] text-slate-400">코드그룹과 코드는 기존 데이터가 참조하므로 등록 후 변경할 수 없습니다.</span>
										</div>
									)}
									<div className="form-field">
										<label>코드명 <span className="req">*</span></label>
										<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="연차" required />
									</div>
									<div className="form-field">
										<label>정렬순서</label>
										<input type="number" min={0} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
									</div>
									<div className="form-field full">
										<label>상위코드</label>
										<input value={form.parentCode} onChange={(e) => setForm({ ...form, parentCode: e.target.value })} placeholder="계층 구조가 아니면 비워 두세요" />
									</div>
								</div>
								<div className="modal-foot" style={{ marginTop: "20px" }}>
									<button type="button" onClick={() => setForm(null)} className="btn-ghost">취소</button>
									<button type="submit" disabled={saving} className="btn-primary">
										{saving ? "저장 중..." : form.id === null ? "등록" : "변경 저장"}
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
