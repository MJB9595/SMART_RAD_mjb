"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSlot } from "@/lib/api/slots";
import { listDepartments } from "@/lib/api/departments";
import { listEmploymentTypes, listPositions } from "@/lib/api/meta";
import { ApiError } from "@/lib/api/client";
import type { Department } from "@/lib/types/department";
import type { EmploymentType, Position } from "@/lib/types/meta";

export default function SlotCreatePage() {
	const router = useRouter();

	const [departments, setDepartments] = useState<Department[]>([]);
	const [positions, setPositions] = useState<Position[]>([]);
	const [employmentTypes, setEmploymentTypes] = useState<EmploymentType[]>([]);

	const [form, setForm] = useState({
		staffCategory: "FACULTY",
		departmentId: "",
		positionId: "",
		employmentTypeId: "",
		role: "EMPLOYEE",
		hireDate: "",
		label: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		listDepartments().then(setDepartments).catch(() => {});
		listPositions().then(setPositions).catch(() => {});
		listEmploymentTypes().then(setEmploymentTypes).catch(() => {});
	}, []);

	function set<K extends keyof typeof form>(key: K, value: string) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	// 교직원 구분에 맞는 직급만 노출 (COMMON은 공용)
	const visiblePositions = positions.filter(
		(p) => p.category === "COMMON" || p.category === form.staffCategory,
	);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		if (!form.departmentId || !form.positionId || !form.employmentTypeId) {
			setError("소속·직급·임용구분은 필수입니다.");
			return;
		}
		setSaving(true);
		try {
			await createSlot({
				staffCategory: form.staffCategory,
				departmentId: Number(form.departmentId),
				positionId: Number(form.positionId),
				employmentTypeId: Number(form.employmentTypeId),
				role: form.role,
				hireDate: form.hireDate || null,
				label: form.label || null,
			});
			alert("승인 자리가 등록되었습니다. 직원이 회원가입 신청하면 승인 시 이 자리로 매칭할 수 있습니다.");
			router.push("/employees");
		} catch (err) {
			setError(err instanceof ApiError ? err.message : "자리 등록에 실패했습니다.");
			setSaving(false);
		}
	}

	return (
		<>
			<div className="breadcrumb">
				인사기록 관리 <b>›</b> 교직원 정보관리 <b>›</b> 교직원 등록(승인 자리)
			</div>
			<div className="title-row">
				<div>
					<div className="page-title">교직원 등록 — 승인 자리 생성</div>
					<div className="page-sub">
						사번·이메일·비밀번호 없이 <b>직위·권한(자리)</b>만 정의합니다. 직원이 회원가입 신청하면, 승인 시 이 자리와 매칭되어 계정이 생성됩니다.
					</div>
				</div>
				<button className="btn-ghost" onClick={() => router.push("/employees")}>목록으로</button>
			</div>

			<form className="card" onSubmit={submit} style={{ maxWidth: 760 }}>
				<div className="modal-body">
					{error && <div className="modal-err">{error}</div>}
					<div className="form-grid">
						<div className="form-field">
							<label>교직원 구분<span className="req">*</span></label>
							<select value={form.staffCategory} onChange={(e) => { set("staffCategory", e.target.value); set("positionId", ""); }}>
								<option value="FACULTY">교원</option>
								<option value="STAFF">직원</option>
							</select>
						</div>
						<div className="form-field">
							<label>권한<span className="req">*</span></label>
							<select value={form.role} onChange={(e) => set("role", e.target.value)}>
								<option value="EMPLOYEE">일반</option>
								<option value="ADMIN">관리자</option>
							</select>
						</div>
						<div className="form-field">
							<label>소속<span className="req">*</span></label>
							<select value={form.departmentId} onChange={(e) => set("departmentId", e.target.value)} required>
								<option value="">선택</option>
								{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
							</select>
						</div>
						<div className="form-field">
							<label>직급<span className="req">*</span></label>
							<select value={form.positionId} onChange={(e) => set("positionId", e.target.value)} required>
								<option value="">선택</option>
								{visiblePositions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
							</select>
						</div>
						<div className="form-field">
							<label>임용구분<span className="req">*</span></label>
							<select value={form.employmentTypeId} onChange={(e) => set("employmentTypeId", e.target.value)} required>
								<option value="">선택</option>
								{employmentTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
							</select>
						</div>
						<div className="form-field">
							<label>예정 임용일</label>
							<input type="date" value={form.hireDate} onChange={(e) => set("hireDate", e.target.value)} />
						</div>
						<div className="form-field full">
							<label>라벨 / 메모 (선택)</label>
							<input value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="예: 2026학년도 신임 조교수" />
						</div>
					</div>
				</div>
				<div className="modal-foot">
					<button type="button" className="btn-ghost" onClick={() => router.push("/employees")}>취소</button>
					<button type="submit" className="btn-primary" disabled={saving}>{saving ? "등록 중..." : "승인 자리 등록"}</button>
				</div>
			</form>
		</>
	);
}
