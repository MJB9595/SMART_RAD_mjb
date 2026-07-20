"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createEmployee } from "@/lib/api/employees";
import { listDepartments } from "@/lib/api/departments";
import { listEmploymentTypes, listPositions } from "@/lib/api/meta";
import { ApiError } from "@/lib/api/client";
import type { Department } from "@/lib/types/department";
import type { EmploymentType, Position } from "@/lib/types/meta";

export default function EmployeeCreatePage() {
	const router = useRouter();

	const [departments, setDepartments] = useState<Department[]>([]);
	const [positions, setPositions] = useState<Position[]>([]);
	const [employmentTypes, setEmploymentTypes] = useState<EmploymentType[]>([]);

	const [form, setForm] = useState({
		employeeNumber: "",
		name: "",
		email: "",
		password: "",
		phone: "",
		staffCategory: "FACULTY",
		departmentId: "",
		positionId: "",
		employmentTypeId: "",
		role: "EMPLOYEE",
		hireDate: "",
		birthDate: "",
		gender: "",
		address: "",
		emergencyContact: "",
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
		if (!form.departmentId || !form.positionId || !form.employmentTypeId || !form.hireDate) {
			setError("소속·직급·임용구분·임용일은 필수입니다.");
			return;
		}
		setSaving(true);
		try {
			const created = await createEmployee({
				employeeNumber: form.employeeNumber,
				name: form.name,
				email: form.email,
				password: form.password,
				phone: form.phone || null,
				staffCategory: form.staffCategory,
				departmentId: Number(form.departmentId),
				positionId: Number(form.positionId),
				employmentTypeId: Number(form.employmentTypeId),
				role: form.role,
				hireDate: form.hireDate,
				birthDate: form.birthDate || null,
				gender: form.gender || null,
				address: form.address || null,
				emergencyContact: form.emergencyContact || null,
			});
			router.push(`/employees/${created.id}`);
		} catch (err) {
			setError(err instanceof ApiError ? err.message : "등록에 실패했습니다.");
			setSaving(false);
		}
	}

	return (
		<>
			<div className="breadcrumb">
				인사기록 관리 <b>›</b> 교직원 정보관리 <b>›</b> 교직원 등록
			</div>
			<div className="title-row">
				<div>
					<div className="page-title">교직원 등록</div>
					<div className="page-sub">신규 교직원의 기본 인적사항을 입력합니다. 학력·경력 등 상세 이력은 등록 후 인사기록카드에서 관리합니다.</div>
				</div>
				<button className="btn-ghost" onClick={() => router.push("/employees")}>목록으로</button>
			</div>

			<form className="card" onSubmit={submit}>
				<div className="modal-body">
					{error && <div className="modal-err">{error}</div>}
					<div className="form-grid">
						<div className="form-field">
							<label>사번<span className="req">*</span></label>
							<input value={form.employeeNumber} onChange={(e) => set("employeeNumber", e.target.value)} required />
						</div>
						<div className="form-field">
							<label>성명<span className="req">*</span></label>
							<input value={form.name} onChange={(e) => set("name", e.target.value)} required />
						</div>
						<div className="form-field">
							<label>이메일<span className="req">*</span></label>
							<input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
						</div>
						<div className="form-field">
							<label>초기 비밀번호<span className="req">*</span></label>
							<input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} minLength={8} required />
						</div>
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
							<label>임용일<span className="req">*</span></label>
							<input type="date" value={form.hireDate} onChange={(e) => set("hireDate", e.target.value)} required />
						</div>
						<div className="form-field">
							<label>생년월일</label>
							<input type="date" value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
						</div>
						<div className="form-field">
							<label>성별</label>
							<select value={form.gender} onChange={(e) => set("gender", e.target.value)}>
								<option value="">선택</option>
								<option value="M">남</option>
								<option value="F">여</option>
							</select>
						</div>
						<div className="form-field">
							<label>연락처</label>
							<input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="010-0000-0000" />
						</div>
						<div className="form-field">
							<label>비상연락처</label>
							<input value={form.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} />
						</div>
						<div className="form-field full">
							<label>주소</label>
							<input value={form.address} onChange={(e) => set("address", e.target.value)} />
						</div>
					</div>
				</div>
				<div className="modal-foot">
					<button type="button" className="btn-ghost" onClick={() => router.push("/employees")}>취소</button>
					<button type="submit" className="btn-primary" disabled={saving}>{saving ? "등록 중..." : "교직원 등록"}</button>
				</div>
			</form>
		</>
	);
}
