"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchEmployees } from "@/lib/api/employees";
import type { Employee } from "@/lib/types/employee";

export default function EmployeesPage() {
	const router = useRouter();
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [loading, setLoading] = useState(true);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

	function load() {
		setLoading(true);
		searchEmployees({})
			.then((page) => {
				setEmployees(page.content);
				setTotalElements(page.totalElements);
				if (page.content.length > 0) {
					setSelectedEmployee(page.content[0]);
				}
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load();
	}, []);

	const getStatusPill = (status: string) => {
		if (status === "EMPLOYED") return <span className="pill green">재직</span>;
		if (status === "ON_LEAVE") return <span className="pill amber">휴직</span>;
		if (status === "RESIGNED") return <span className="pill gray">퇴직</span>;
		return <span className="pill gray">{status}</span>;
	};

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">인사기록카드</div>
					<div className="page-sub">학력·경력·자격·포상·징계 이력을 통합 조회하고 관리합니다</div>
				</div>
				<button className="btn-primary" onClick={() => router.push('/employees/new')}>+ 인사기록카드 등록</button>
			</div>

			<div className="stat-grid">
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">전체 교직원</span></div>
					<div className="stat-value">{totalElements}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">재직 중</span></div>
					<div className="stat-value">{employees.filter(e => e.employmentStatus === 'EMPLOYED').length}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">휴직 중</span></div>
					<div className="stat-value">{employees.filter(e => e.employmentStatus === 'ON_LEAVE').length}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">이번달 갱신 필요 자격</span><span className="badge new">신규</span></div>
					<div className="stat-value">0<span>건</span></div>
				</div>
			</div>

			<div className="split">
				<div className="card">
					<div className="card-head">
						<div className="card-title">인사기록카드 목록</div>
						<div className="head-actions">
							<button className="btn-ghost">필터</button>
							<button className="btn-ghost">내보내기</button>
						</div>
					</div>
					<table>
						<thead>
							<tr>
								<th>사번</th>
								<th>이름</th>
								<th>소속</th>
								<th>직급</th>
								<th>재직상태</th>
								<th>등록일</th>
							</tr>
						</thead>
						<tbody>
							{employees.map((emp) => (
								<tr key={emp.id} onClick={() => setSelectedEmployee(emp)} style={{cursor:'pointer'}}>
									<td>
										<div className="cell-person">
											<div className="avatar-sm">{emp.name.slice(0, 1)}</div>
											<div>
												<div className="p-name">{emp.name}</div>
												<div className="p-sub">{emp.departmentName}</div>
											</div>
										</div>
									</td>
									<td className="mono">{emp.employeeNumber}</td>
									<td>{emp.departmentName}</td>
									<td>{emp.positionName}</td>
									<td>{getStatusPill(emp.employmentStatus)}</td>
									<td className="mono">{emp.hireDate}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="table-foot">
						<span className="foot-info">전체 {totalElements}건 중 1–{employees.length}건 표시</span>
						<div className="pager">
							<span className="cur">1</span>
						</div>
					</div>
				</div>

				{selectedEmployee && (
					<div className="card">
						<div className="panel">
							<div className="panel-eyebrow">인사기록카드 미리보기</div>
							<div className="panel-avatar">{selectedEmployee.name.slice(0, 1)}</div>
							<div className="panel-name">{selectedEmployee.name}</div>
							<div className="panel-role">{selectedEmployee.departmentName} · {selectedEmployee.positionName}</div>
							<div className="field-row">
								<span className="field-label">사번</span>
								<span className="field-value mono">{selectedEmployee.employeeNumber}</span>
							</div>
							<div className="field-row">
								<span className="field-label">임용일</span>
								<span className="field-value mono">{selectedEmployee.hireDate}</span>
							</div>
							<div className="field-row">
								<span className="field-label">최종학력</span>
								<span className="field-value">-</span>
							</div>
							<div className="field-row">
								<span className="field-label">자격증</span>
								<span className="field-value">-</span>
							</div>
							<div className="mini-stats">
								<div className="mini-stat"><div className="mini-stat-label">근속연수</div><div className="mini-stat-value">-</div></div>
								<div className="mini-stat"><div className="mini-stat-label">포상</div><div className="mini-stat-value">-</div></div>
								<div className="mini-stat"><div className="mini-stat-label">징계</div><div className="mini-stat-value">-</div></div>
							</div>
							<button className="btn-outline" onClick={() => router.push(`/employees/${selectedEmployee.id}`)}>
								전체 기록 상세보기
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
