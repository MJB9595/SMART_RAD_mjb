"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	changeEmploymentStatus,
	getEmployee,
	updateEmployee,
} from "@/lib/api/employees";
import { listDepartments } from "@/lib/api/departments";
import { listEmploymentTypes, listPositions } from "@/lib/api/meta";
import {
	createCareer, createCertification, createEducation, createFamily, createLanguage, createMilitary,
	deleteCareer, deleteCertification, deleteEducation, deleteFamily, deleteLanguage, deleteMilitary,
	getCareers, getCertifications, getEducations, getFamilies, getLanguages, getMilitaries,
	updateCareer, updateCertification, updateEducation, updateFamily, updateLanguage, updateMilitary,
	type RecordBody,
} from "@/lib/api/records";
import { ApiError } from "@/lib/api/client";
import { RecordFormModal, type FieldDef, type RecordValues } from "@/components/RecordFormModal";
import type {
	Career, Certification, Education, Employee, Family, Language, Military,
} from "@/lib/types/employee";
import type { Department } from "@/lib/types/department";
import type { EmploymentType, Position } from "@/lib/types/meta";

const CATEGORY_LABEL: Record<string, string> = { FACULTY: "교원", STAFF: "직원" };
const STATUS: Record<string, { cls: string; label: string }> = {
	EMPLOYED: { cls: "green", label: "재직" },
	ON_LEAVE: { cls: "amber", label: "휴직" },
	RESIGNED: { cls: "gray", label: "퇴직" },
};

const TABS = ["학력", "경력", "자격증", "가족", "병역", "어학"] as const;
type Tab = (typeof TABS)[number];

// ===== 탭별 폼 필드 정의 =====
const EDU_FIELDS: FieldDef[] = [
	{ key: "schoolName", label: "학교명", required: true },
	{ key: "major", label: "전공" },
	{ key: "degree", label: "학위", type: "select", options: ["학사", "석사", "박사", "전문학사", "고졸"].map((v) => ({ value: v, label: v })) },
	{ key: "status", label: "상태", type: "select", options: ["졸업", "재학", "수료", "휴학", "중퇴"].map((v) => ({ value: v, label: v })) },
	{ key: "admissionDate", label: "입학일", type: "date" },
	{ key: "graduationDate", label: "졸업일", type: "date" },
];
const CAREER_FIELDS: FieldDef[] = [
	{ key: "companyName", label: "기관/회사", required: true },
	{ key: "department", label: "부서" },
	{ key: "position", label: "직위" },
	{ key: "startDate", label: "시작일", type: "date", required: true },
	{ key: "endDate", label: "종료일", type: "date" },
	{ key: "jobDescription", label: "담당업무", full: true },
];
const CERT_FIELDS: FieldDef[] = [
	{ key: "name", label: "자격증명", required: true },
	{ key: "issuer", label: "발급기관" },
	{ key: "certNumber", label: "자격번호" },
	{ key: "acquiredDate", label: "취득일", type: "date" },
	{ key: "expiryDate", label: "만료일", type: "date" },
];
const FAMILY_FIELDS: FieldDef[] = [
	{ key: "familyName", label: "가족성명", required: true },
	{ key: "familyRelation", label: "관계", required: true, type: "select", options: ["배우자", "자녀", "부", "모", "조부", "조모", "형제", "자매", "기타"].map((v) => ({ value: v, label: v })) },
	{ key: "birthDate", label: "생년월일", type: "date" },
	{ key: "job", label: "직업" },
	{ key: "livingTogether", label: "동거", type: "checkbox" },
	{ key: "dependent", label: "부양", type: "checkbox" },
	{ key: "disabled", label: "장애", type: "checkbox" },
];
const MILITARY_FIELDS: FieldDef[] = [
	{ key: "militaryType", label: "군별", placeholder: "육군/해군/공군 등" },
	{ key: "militaryRank", label: "계급" },
	{ key: "dischargeType", label: "병역구분", type: "select", options: ["만기전역", "의가사전역", "의병전역", "면제", "복무중", "해당없음"].map((v) => ({ value: v, label: v })) },
	{ key: "enlistmentDate", label: "입대일", type: "date" },
	{ key: "dischargeDate", label: "전역일", type: "date" },
	{ key: "exemptionReason", label: "면제사유", full: true },
];
const LANG_FIELDS: FieldDef[] = [
	{ key: "languageName", label: "언어", required: true },
	{ key: "testName", label: "시험명" },
	{ key: "testScore", label: "점수/등급" },
	{ key: "speakingLevel", label: "회화수준", type: "select", options: ["상", "중", "하"].map((v) => ({ value: v, label: v })) },
	{ key: "issuedDate", label: "취득일", type: "date" },
	{ key: "issuer", label: "발급기관" },
];

function recordToValues(record: Record<string, unknown>, fields: FieldDef[]): RecordValues {
	const v: RecordValues = {};
	for (const f of fields) {
		const raw = record[f.key];
		if (f.type === "checkbox") v[f.key] = Boolean(raw);
		else v[f.key] = raw == null ? "" : String(raw);
	}
	return v;
}
function blankValues(fields: FieldDef[]): RecordValues {
	const v: RecordValues = {};
	for (const f of fields) v[f.key] = f.type === "checkbox" ? false : "";
	return v;
}
const yn = (b: boolean | null | undefined) => (b ? "○" : "-");

interface ModalState {
	title: string;
	fields: FieldDef[];
	initial: RecordValues;
	onSubmit: (v: RecordValues) => Promise<void>;
}

export default function EmployeeDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const empId = Number(params.id);

	const [employee, setEmployee] = useState<Employee | null>(null);
	const [tab, setTab] = useState<Tab>("학력");
	const [error, setError] = useState<string | null>(null);
	const [modal, setModal] = useState<ModalState | null>(null);

	// 메타(수정 폼 셀렉트용)
	const [departments, setDepartments] = useState<Department[]>([]);
	const [positions, setPositions] = useState<Position[]>([]);
	const [employmentTypes, setEmploymentTypes] = useState<EmploymentType[]>([]);

	// 탭 데이터
	const [educations, setEducations] = useState<Education[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);
	const [certifications, setCertifications] = useState<Certification[]>([]);
	const [families, setFamilies] = useState<Family[]>([]);
	const [militaries, setMilitaries] = useState<Military[]>([]);
	const [languages, setLanguages] = useState<Language[]>([]);

	const reloadEmployee = useCallback(() => {
		getEmployee(empId).then(setEmployee).catch((e) =>
			setError(e instanceof ApiError ? e.message : "인사기록을 불러오지 못했습니다."));
	}, [empId]);

	useEffect(() => {
		if (!empId) return;
		reloadEmployee();
		listDepartments().then(setDepartments).catch(() => {});
		listPositions().then(setPositions).catch(() => {});
		listEmploymentTypes().then(setEmploymentTypes).catch(() => {});
		getEducations(empId).then(setEducations).catch(() => {});
		getCareers(empId).then(setCareers).catch(() => {});
		getCertifications(empId).then(setCertifications).catch(() => {});
		getFamilies(empId).then(setFamilies).catch(() => {});
		getMilitaries(empId).then(setMilitaries).catch(() => {});
		getLanguages(empId).then(setLanguages).catch(() => {});
	}, [empId, reloadEmployee]);

	// 공통: 기록 등록/수정 모달 열기
	function openRecord(
		title: string,
		fields: FieldDef[],
		record: { id: number } | null,
		create: (id: number, body: RecordBody) => Promise<unknown>,
		update: (id: number, body: RecordBody) => Promise<unknown>,
		reload: () => void,
	) {
		setModal({
			title,
			fields,
			initial: record ? recordToValues(record as Record<string, unknown>, fields) : blankValues(fields),
			onSubmit: async (v) => {
				if (record) await update(record.id, v);
				else await create(empId, v);
				reload();
				setModal(null);
			},
		});
	}

	async function removeRecord(remove: (id: number) => Promise<void>, id: number, reload: () => void) {
		if (!confirm("삭제하시겠습니까?")) return;
		await remove(id);
		reload();
	}

	function reloadEdu() { getEducations(empId).then(setEducations); }
	function reloadCareer() { getCareers(empId).then(setCareers); }
	function reloadCert() { getCertifications(empId).then(setCertifications); }
	function reloadFam() { getFamilies(empId).then(setFamilies); }
	function reloadMil() { getMilitaries(empId).then(setMilitaries); }
	function reloadLang() { getLanguages(empId).then(setLanguages); }

	// 기본정보 수정
	function openEmployeeEdit() {
		if (!employee) return;
		const visiblePositions = positions.filter((p) => p.category === "COMMON" || p.category === employee.staffCategory);
		const fields: FieldDef[] = [
			{ key: "name", label: "성명", required: true },
			{ key: "phone", label: "연락처" },
			{ key: "departmentId", label: "소속", required: true, type: "select", options: departments.map((d) => ({ value: String(d.id), label: d.name })) },
			{ key: "positionId", label: "직급", required: true, type: "select", options: visiblePositions.map((p) => ({ value: String(p.id), label: p.name })) },
			{ key: "employmentTypeId", label: "임용구분", required: true, type: "select", options: employmentTypes.map((t) => ({ value: String(t.id), label: t.name })) },
			{ key: "emergencyContact", label: "비상연락처" },
			{ key: "address", label: "주소", full: true },
		];
		const initial: RecordValues = {
			name: employee.name,
			phone: employee.phone ?? "",
			departmentId: String(employee.departmentId),
			positionId: String(employee.positionId),
			employmentTypeId: String(employee.employmentTypeId),
			emergencyContact: employee.emergencyContact ?? "",
			address: employee.address ?? "",
		};
		setModal({
			title: "기본정보 수정",
			fields,
			initial,
			onSubmit: async (v) => {
				await updateEmployee(empId, {
					name: String(v.name),
					phone: (v.phone as string) || null,
					departmentId: Number(v.departmentId),
					positionId: Number(v.positionId),
					employmentTypeId: Number(v.employmentTypeId),
					address: (v.address as string) || null,
					emergencyContact: (v.emergencyContact as string) || null,
				});
				reloadEmployee();
				setModal(null);
			},
		});
	}

	// 재직상태 변경
	function openStatusChange() {
		if (!employee) return;
		const fields: FieldDef[] = [
			{ key: "employmentStatus", label: "재직상태", required: true, type: "select", options: [
				{ value: "EMPLOYED", label: "재직" }, { value: "ON_LEAVE", label: "휴직" }, { value: "RESIGNED", label: "퇴직" },
			] },
			{ key: "resignDate", label: "퇴직일 (퇴직 시)", type: "date" },
		];
		setModal({
			title: "재직상태 변경",
			fields,
			initial: { employmentStatus: employee.employmentStatus, resignDate: employee.resignDate ?? "" },
			onSubmit: async (v) => {
				await changeEmploymentStatus(empId, {
					employmentStatus: String(v.employmentStatus),
					resignDate: (v.resignDate as string) || null,
				});
				reloadEmployee();
				setModal(null);
			},
		});
	}

	if (error) return <p style={{ color: "#DC2626", fontSize: 13 }}>{error}</p>;
	if (!employee) return <p style={{ color: "#8A94A6", fontSize: 13 }}>불러오는 중...</p>;

	const st = STATUS[employee.employmentStatus] ?? { cls: "gray", label: employee.employmentStatus };
	const counts: Record<Tab, number> = {
		학력: educations.length, 경력: careers.length, 자격증: certifications.length,
		가족: families.length, 병역: militaries.length, 어학: languages.length,
	};

	return (
		<>
			<div className="breadcrumb">
				인사기록 관리 <b>›</b> 교직원 정보관리 <b>›</b> 인사기록카드
			</div>
			<div className="title-row">
				<div>
					<div className="page-title">
						{employee.name}
						<span style={{ fontSize: 15, fontWeight: 600, color: "#8A94A6", marginLeft: 8 }}>({employee.employeeNumber})</span>
						<span className={`pill ${employee.staffCategory === "FACULTY" ? "blue" : "gray"}`} style={{ marginLeft: 10, verticalAlign: "middle" }}>
							{CATEGORY_LABEL[employee.staffCategory]}
						</span>
						<span className={`pill ${st.cls}`} style={{ marginLeft: 6, verticalAlign: "middle" }}>{st.label}</span>
					</div>
					<div className="page-sub">{employee.departmentName} · {employee.positionName} · {employee.employmentTypeName}</div>
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<button className="btn-ghost" onClick={openStatusChange}>재직상태 변경</button>
					<button className="btn-ghost" onClick={openEmployeeEdit}>기본정보 수정</button>
					<button className="btn-ghost" onClick={() => router.push("/employees")}>목록으로</button>
				</div>
			</div>

			{/* 기본 인적사항 */}
			<div className="info-card">
				<div className="info-item"><span className="lbl">구분</span><span className="val">{CATEGORY_LABEL[employee.staffCategory]}</span></div>
				<div className="info-item"><span className="lbl">이메일</span><span className="val">{employee.email}</span></div>
				<div className="info-item"><span className="lbl">소속</span><span className="val">{employee.departmentName}</span></div>
				<div className="info-item"><span className="lbl">연락처</span><span className="val">{employee.phone ?? "-"}</span></div>
				<div className="info-item"><span className="lbl">직급</span><span className="val">{employee.positionName}</span></div>
				<div className="info-item"><span className="lbl">생년월일</span><span className="val">{employee.birthDate ?? "-"}</span></div>
				<div className="info-item"><span className="lbl">임용구분</span><span className="val">{employee.employmentTypeName}</span></div>
				<div className="info-item"><span className="lbl">임용일</span><span className="val">{employee.hireDate}</span></div>
				<div className="info-item"><span className="lbl">비상연락처</span><span className="val">{employee.emergencyContact ?? "-"}</span></div>
				<div className="info-item"><span className="lbl">주소</span><span className="val">{employee.address ?? "-"}</span></div>
			</div>

			{/* 기록 탭 */}
			<div className="card">
				<div style={{ padding: "0 22px" }}>
					<div className="tabs">
						{TABS.map((t) => (
							<button key={t} className={`tab-btn ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>
								{t}<span className="cnt">{counts[t]}</span>
							</button>
						))}
					</div>
					<div className="rec-toolbar">
						<div className="rec-title">{tab} 이력</div>
						<button className="btn-sm primary" onClick={() => {
							if (tab === "학력") openRecord("학력 등록", EDU_FIELDS, null, createEducation, updateEducation, reloadEdu);
							else if (tab === "경력") openRecord("경력 등록", CAREER_FIELDS, null, createCareer, updateCareer, reloadCareer);
							else if (tab === "자격증") openRecord("자격증 등록", CERT_FIELDS, null, createCertification, updateCertification, reloadCert);
							else if (tab === "가족") openRecord("가족사항 등록", FAMILY_FIELDS, null, createFamily, updateFamily, reloadFam);
							else if (tab === "병역") openRecord("병역정보 등록", MILITARY_FIELDS, null, createMilitary, updateMilitary, reloadMil);
							else openRecord("어학정보 등록", LANG_FIELDS, null, createLanguage, updateLanguage, reloadLang);
						}}>+ {tab} 추가</button>
					</div>
				</div>

				{tab === "학력" && (
					<RecTable headers={["학교명", "전공", "학위", "입학일", "졸업일", "상태"]}>
						{educations.map((e) => (
							<tr key={e.id}>
								<td>{e.schoolName}</td><td>{e.major ?? "-"}</td><td>{e.degree ?? "-"}</td>
								<td className="mono">{e.admissionDate ?? "-"}</td><td className="mono">{e.graduationDate ?? "-"}</td><td>{e.status ?? "-"}</td>
								<Actions
									onEdit={() => openRecord("학력 수정", EDU_FIELDS, e, createEducation, updateEducation, reloadEdu)}
									onDelete={() => removeRecord(deleteEducation, e.id, reloadEdu)} />
							</tr>
						))}
						{educations.length === 0 && <EmptyRow cols={7} />}
					</RecTable>
				)}
				{tab === "경력" && (
					<RecTable headers={["기관/회사", "부서", "직위", "시작일", "종료일", "담당업무"]}>
						{careers.map((c) => (
							<tr key={c.id}>
								<td>{c.companyName}</td><td>{c.department ?? "-"}</td><td>{c.position ?? "-"}</td>
								<td className="mono">{c.startDate}</td><td className="mono">{c.endDate ?? "재직중"}</td><td>{c.jobDescription ?? "-"}</td>
								<Actions
									onEdit={() => openRecord("경력 수정", CAREER_FIELDS, c, createCareer, updateCareer, reloadCareer)}
									onDelete={() => removeRecord(deleteCareer, c.id, reloadCareer)} />
							</tr>
						))}
						{careers.length === 0 && <EmptyRow cols={7} />}
					</RecTable>
				)}
				{tab === "자격증" && (
					<RecTable headers={["자격증명", "발급기관", "자격번호", "취득일", "만료일"]}>
						{certifications.map((c) => (
							<tr key={c.id}>
								<td>{c.name}</td><td>{c.issuer ?? "-"}</td><td className="mono">{c.certNumber ?? "-"}</td>
								<td className="mono">{c.acquiredDate ?? "-"}</td><td className="mono">{c.expiryDate ?? "-"}</td>
								<Actions
									onEdit={() => openRecord("자격증 수정", CERT_FIELDS, c, createCertification, updateCertification, reloadCert)}
									onDelete={() => removeRecord(deleteCertification, c.id, reloadCert)} />
							</tr>
						))}
						{certifications.length === 0 && <EmptyRow cols={6} />}
					</RecTable>
				)}
				{tab === "가족" && (
					<RecTable headers={["성명", "관계", "생년월일", "직업", "동거", "부양", "장애"]}>
						{families.map((f) => (
							<tr key={f.id}>
								<td>{f.familyName}</td><td>{f.familyRelation}</td><td className="mono">{f.birthDate ?? "-"}</td><td>{f.job ?? "-"}</td>
								<td>{yn(f.livingTogether)}</td><td>{yn(f.dependent)}</td><td>{yn(f.disabled)}</td>
								<Actions
									onEdit={() => openRecord("가족사항 수정", FAMILY_FIELDS, f, createFamily, updateFamily, reloadFam)}
									onDelete={() => removeRecord(deleteFamily, f.id, reloadFam)} />
							</tr>
						))}
						{families.length === 0 && <EmptyRow cols={8} />}
					</RecTable>
				)}
				{tab === "병역" && (
					<RecTable headers={["군별", "계급", "병역구분", "입대일", "전역일", "면제사유"]}>
						{militaries.map((m) => (
							<tr key={m.id}>
								<td>{m.militaryType ?? "-"}</td><td>{m.militaryRank ?? "-"}</td><td>{m.dischargeType ?? "-"}</td>
								<td className="mono">{m.enlistmentDate ?? "-"}</td><td className="mono">{m.dischargeDate ?? "-"}</td><td>{m.exemptionReason ?? "-"}</td>
								<Actions
									onEdit={() => openRecord("병역정보 수정", MILITARY_FIELDS, m, createMilitary, updateMilitary, reloadMil)}
									onDelete={() => removeRecord(deleteMilitary, m.id, reloadMil)} />
							</tr>
						))}
						{militaries.length === 0 && <EmptyRow cols={7} />}
					</RecTable>
				)}
				{tab === "어학" && (
					<RecTable headers={["언어", "시험명", "점수/등급", "회화", "취득일", "발급기관"]}>
						{languages.map((l) => (
							<tr key={l.id}>
								<td>{l.languageName}</td><td>{l.testName ?? "-"}</td><td>{l.testScore ?? "-"}</td><td>{l.speakingLevel ?? "-"}</td>
								<td className="mono">{l.issuedDate ?? "-"}</td><td>{l.issuer ?? "-"}</td>
								<Actions
									onEdit={() => openRecord("어학정보 수정", LANG_FIELDS, l, createLanguage, updateLanguage, reloadLang)}
									onDelete={() => removeRecord(deleteLanguage, l.id, reloadLang)} />
							</tr>
						))}
						{languages.length === 0 && <EmptyRow cols={7} />}
					</RecTable>
				)}
			</div>

			{modal && (
				<RecordFormModal
					title={modal.title}
					fields={modal.fields}
					initial={modal.initial}
					onClose={() => setModal(null)}
					onSubmit={modal.onSubmit}
				/>
			)}
		</>
	);
}

function RecTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
	return (
		<table>
			<thead>
				<tr>{headers.map((h) => <th key={h}>{h}</th>)}<th style={{ textAlign: "right" }}>관리</th></tr>
			</thead>
			<tbody>{children}</tbody>
		</table>
	);
}

function Actions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
	return (
		<td>
			<div className="row-actions" style={{ justifyContent: "flex-end" }}>
				<button className="btn-sm" onClick={onEdit}>수정</button>
				<button className="btn-sm danger" onClick={onDelete}>삭제</button>
			</div>
		</td>
	);
}

function EmptyRow({ cols }: { cols: number }) {
	return <tr className="empty-row"><td colSpan={cols}>등록된 정보가 없습니다.</td></tr>;
}
