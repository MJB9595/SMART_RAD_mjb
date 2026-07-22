"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchEmployees } from "@/lib/api/employees";
import { listDepartments } from "@/lib/api/departments";
import { countExpiringCertifications, getRecordSummary } from "@/lib/api/records";
import type { Employee, EmployeeRecordSummary } from "@/lib/types/employee";
import type { Department } from "@/lib/types/department";
import { SignupApprovalModal } from "@/components/SignupApprovalModal";

const PAGE_SIZE = 10;

const STATUS_PILL: Record<string, { cls: string; label: string }> = {
	EMPLOYED: { cls: "green", label: "재직" },
	ON_LEAVE: { cls: "amber", label: "휴직" },
	RESIGNED: { cls: "gray", label: "퇴직" },
};

export default function EmployeesPage() {
	const router = useRouter();

	// 필터
	const [keyword, setKeyword] = useState("");
	const [staffCategory, setStaffCategory] = useState("");
	const [departmentId, setDepartmentId] = useState("");
	const [employmentStatus, setEmploymentStatus] = useState("");
	const [page, setPage] = useState(0);

	// 데이터
	const [departments, setDepartments] = useState<Department[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);

	// 통계(조직 전체 · 필터 무관)
	const [stats, setStats] = useState({ total: 0, employed: 0, onLeave: 0, expiring: 0 });

	// 미리보기
	const [selected, setSelected] = useState<Employee | null>(null);
	const [summary, setSummary] = useState<EmployeeRecordSummary | null>(null);

	// 모달
	const [showApprovalModal, setShowApprovalModal] = useState(false);

	useEffect(() => {
		listDepartments().then(setDepartments).catch(() => setDepartments([]));
		Promise.all([
			searchEmployees({ size: 1 }),
			searchEmployees({ size: 1, employmentStatus: "EMPLOYED" }),
			searchEmployees({ size: 1, employmentStatus: "ON_LEAVE" }),
			countExpiringCertifications(90),
		])
			.then(([all, emp, leave, exp]) =>
				setStats({
					total: all.totalElements,
					employed: emp.totalElements,
					onLeave: leave.totalElements,
					expiring: exp.count,
				}),
			)
			.catch(console.error);
	}, []);

	// 목록 조회 (필터/페이지 변경 시)
	useEffect(() => {
		let active = true;
		searchEmployees({
			keyword: keyword.trim() || undefined,
			staffCategory: staffCategory || undefined,
			departmentId: departmentId || undefined,
			employmentStatus: employmentStatus || undefined,
			page,
			size: PAGE_SIZE,
		})
			.then((res) => {
				if (!active) return;
				setEmployees(res.content);
				setTotalElements(res.totalElements);
				setTotalPages(res.totalPages);
				setSelected((prev) => (prev && res.content.some((e) => e.id === prev.id) ? prev : res.content[0] ?? null));
				setLoading(false);
			})
			.catch(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [keyword, staffCategory, departmentId, employmentStatus, page]);

	// 선택 교직원 요약 조회
	useEffect(() => {
		if (!selected) return;
		let active = true;
		getRecordSummary(selected.id)
			.then((s) => active && setSummary(s))
			.catch(() => active && setSummary(null));
		return () => {
			active = false;
		};
	}, [selected]);

	function changeFilter(setter: (v: string) => void, value: string) {
		setter(value);
		setPage(0);
	}
	function resetFilters() {
		setKeyword("");
		setStaffCategory("");
		setDepartmentId("");
		setEmploymentStatus("");
		setPage(0);
	}

	const hasFilter = keyword || staffCategory || departmentId || employmentStatus;
	const from = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
	const to = Math.min((page + 1) * PAGE_SIZE, totalElements);
	// 이전 선택의 요약이 남아있을 수 있어 employeeId로 정합성 확인
	const s = summary && selected && summary.employeeId === selected.id ? summary : null;

	return (
		<>
			<div className="breadcrumb">
				인사기록 관리 <b>›</b> 교직원 정보관리
			</div>
			<div className="title-row">
				<div>
					<div className="page-title">교직원 정보관리</div>
					<div className="page-sub">교직원 인사기록카드를 조회·등록하고 학력·경력·자격 이력을 관리합니다</div>
				</div>
				<div className="flex gap-2">
					<button className="btn-outline text-blue-600 border-blue-600 hover:bg-blue-50 relative px-4" onClick={() => setShowApprovalModal(true)}>
						교직원 가입 승인
						<span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
					</button>
					<button className="btn-primary" onClick={() => router.push("/employees/new")}>
						+ 교직원 등록
					</button>
				</div>
			</div>

			<div className="stat-grid">
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">전체 교직원</span></div>
					<div className="stat-value">{stats.total}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">재직 중</span><span className="badge up">재직</span></div>
					<div className="stat-value">{stats.employed}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">휴직 중</span><span className="badge new">휴직</span></div>
					<div className="stat-value">{stats.onLeave}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">갱신 필요 자격 (90일 내)</span><span className="badge down">만료임박</span></div>
					<div className="stat-value">{stats.expiring}<span>건</span></div>
				</div>
			</div>

			<div className="split">
				<div className="card">
					<div className="card-head">
						<div className="card-title">교직원 목록</div>
						<div className="head-actions">
							<span className="foot-info">{totalElements}명</span>
						</div>
					</div>

					<div className="filter-bar">
						<input
							className="filter-input"
							placeholder="이름 또는 사번 검색"
							value={keyword}
							onChange={(e) => changeFilter(setKeyword, e.target.value)}
						/>
						<select className="filter-select" value={staffCategory} onChange={(e) => changeFilter(setStaffCategory, e.target.value)}>
							<option value="">구분 전체</option>
							<option value="FACULTY">교원</option>
							<option value="STAFF">직원</option>
						</select>
						<select className="filter-select" value={departmentId} onChange={(e) => changeFilter(setDepartmentId, e.target.value)}>
							<option value="">소속 전체</option>
							{departments.map((d) => (
								<option key={d.id} value={d.id}>{d.name}</option>
							))}
						</select>
						<select className="filter-select" value={employmentStatus} onChange={(e) => changeFilter(setEmploymentStatus, e.target.value)}>
							<option value="">재직상태 전체</option>
							<option value="EMPLOYED">재직</option>
							<option value="ON_LEAVE">휴직</option>
							<option value="RESIGNED">퇴직</option>
						</select>
						{hasFilter && <button className="filter-reset" onClick={resetFilters}>초기화</button>}
					</div>

					<table>
						<thead>
							<tr>
								<th>이름</th>
								<th>사번</th>
								<th>구분</th>
								<th>소속</th>
								<th>직급</th>
								<th>재직상태</th>
								<th>임용일</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr className="empty-row"><td colSpan={7}>불러오는 중...</td></tr>
							) : employees.length === 0 ? (
								<tr className="empty-row"><td colSpan={7}>조건에 맞는 교직원이 없습니다.</td></tr>
							) : (
								employees.map((emp) => {
									const st = STATUS_PILL[emp.employmentStatus] ?? { cls: "gray", label: emp.employmentStatus };
									return (
										<tr
											key={emp.id}
											onClick={() => setSelected(emp)}
											style={{ cursor: "pointer", background: selected?.id === emp.id ? "#F7F9FF" : undefined }}
										>
											<td>
												<div className="cell-person">
													<div className="avatar-sm">{emp.name.slice(0, 1)}</div>
													<div>
														<div className="p-name">{emp.name}</div>
														<div className="p-sub">{emp.email}</div>
													</div>
												</div>
											</td>
											<td className="mono">{emp.employeeNumber}</td>
											<td>
												<span className={`pill ${emp.staffCategory === "FACULTY" ? "blue" : "gray"}`}>
													{emp.staffCategory === "FACULTY" ? "교원" : "직원"}
												</span>
											</td>
											<td>{emp.departmentName}</td>
											<td>{emp.positionName}</td>
											<td><span className={`pill ${st.cls}`}>{st.label}</span></td>
											<td className="mono">{emp.hireDate}</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>

					<div className="table-foot">
						<span className="foot-info">
							전체 {totalElements}건 중 {from}–{to}건 표시
						</span>
						<div className="pager">
							<span onClick={() => page > 0 && setPage(page - 1)} style={{ opacity: page > 0 ? 1 : 0.4 }}>‹</span>
							{Array.from({ length: totalPages }, (_, i) => i)
								.filter((i) => Math.abs(i - page) <= 2 || i === 0 || i === totalPages - 1)
								.map((i, idx, arr) => (
									<span key={i} style={{ display: "contents" }}>
										{idx > 0 && arr[idx - 1] !== i - 1 ? <span style={{ cursor: "default" }}>…</span> : null}
										<span className={i === page ? "cur" : ""} onClick={() => setPage(i)}>{i + 1}</span>
									</span>
								))}
							<span
								onClick={() => page < totalPages - 1 && setPage(page + 1)}
								style={{ opacity: page < totalPages - 1 ? 1 : 0.4 }}
							>›</span>
						</div>
					</div>
				</div>

				{selected && (
					<div className="card">
						<div className="panel">
							<div className="panel-eyebrow">인사기록카드 미리보기</div>
							<div className="panel-avatar">{selected.name.slice(0, 1)}</div>
							<div className="panel-name">{selected.name}</div>
							<div className="panel-role">
								{selected.departmentName} · {selected.positionName}
								<span style={{ marginLeft: 6, color: "#1F3A8F", fontWeight: 700 }}>
									{selected.staffCategory === "FACULTY" ? "교원" : "직원"}
								</span>
							</div>
							<div className="field-row">
								<span className="field-label">사번</span>
								<span className="field-value mono">{selected.employeeNumber}</span>
							</div>
							<div className="field-row">
								<span className="field-label">임용일</span>
								<span className="field-value mono">{selected.hireDate}</span>
							</div>
							<div className="field-row">
								<span className="field-label">최종학력</span>
								<span className="field-value">{s?.latestEducation ?? "-"}</span>
							</div>
							<div className="field-row">
								<span className="field-label">대표자격</span>
								<span className="field-value">{s?.topCertification ?? "-"}</span>
							</div>
							<div className="mini-stats">
								<div className="mini-stat">
									<div className="mini-stat-label">근속연수</div>
									<div className="mini-stat-value">{s?.yearsOfService != null ? `${s.yearsOfService}년` : "-"}</div>
								</div>
								<div className="mini-stat">
									<div className="mini-stat-label">자격증</div>
									<div className="mini-stat-value">{s ? s.certificationCount : "-"}</div>
								</div>
								<div className="mini-stat">
									<div className="mini-stat-label">경력</div>
									<div className="mini-stat-value">{s ? s.careerCount : "-"}</div>
								</div>
							</div>
							<button className="btn-outline" onClick={() => router.push(`/employees/${selected.id}`)}>
								전체 기록 상세보기
							</button>
						</div>
					</div>
				)}
			</div>
			
			{showApprovalModal && <SignupApprovalModal onClose={() => setShowApprovalModal(false)} />}
		</>
	);
}
