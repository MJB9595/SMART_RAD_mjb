"use client";

import { useEffect, useState, type FormEvent } from "react";
import { searchEmployees } from "@/lib/api/employees";
import { listDepartments } from "@/lib/api/departments";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Input, Select } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import type { Employee } from "@/lib/types/employee";
import type { Department } from "@/lib/types/department";

export default function EmployeesPage() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [keyword, setKeyword] = useState("");
	const [departmentId, setDepartmentId] = useState("");
	const [employmentStatus, setEmploymentStatus] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	function load(params: { keyword?: string; departmentId?: string; employmentStatus?: string } = {}) {
		setLoading(true);
		setError(null);
		searchEmployees(params)
			.then((page) => setEmployees(page.content))
			.catch((err) => setError(err instanceof ApiError ? err.message : "사원 목록을 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load();
		listDepartments().then(setDepartments).catch(() => setDepartments([]));
	}, []);

	function handleSearch(e: FormEvent) {
		e.preventDefault();
		load({ keyword, departmentId, employmentStatus });
	}

	function handleReset() {
		setKeyword("");
		setDepartmentId("");
		setEmploymentStatus("");
		load();
	}

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				인사관리 <span className="mx-1">›</span> 인사정보 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">인사정보등록</span>
			</nav>

			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">인사정보등록</h1>
					<p className="mt-1 text-sm text-slate-500">임직원의 인사정보를 조회하고 관리합니다.</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">엑셀 다운로드</Button>
					<Button variant="primary">사원 등록</Button>
				</div>
			</div>

			<form
				onSubmit={handleSearch}
				className="mb-6 rounded-lg border border-slate-200 p-6"
			>
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex flex-wrap items-end gap-4">
					<Field label="이름/사원번호">
						<Input
							placeholder="이름 또는 사원번호 입력"
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						/>
					</Field>
					<Field label="부서">
						<Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
							<option value="">전체</option>
							{departments.map((d) => (
								<option key={d.id} value={d.id}>
									{d.name}
								</option>
							))}
						</Select>
					</Field>
					<Field label="재직상태">
						<Select value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)}>
							<option value="">전체</option>
							<option value="EMPLOYED">재직</option>
							<option value="ON_LEAVE">휴직</option>
							<option value="RESIGNED">퇴직</option>
						</Select>
					</Field>
					<Button type="submit" variant="primary">
						조회
					</Button>
					<Button type="button" variant="outline" onClick={handleReset}>
						초기화
					</Button>
				</div>
			</form>

			{loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && !error && (
				<>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
								<th className="p-3 font-medium">사원번호</th>
								<th className="p-3 font-medium">이름</th>
								<th className="p-3 font-medium">부서</th>
								<th className="p-3 font-medium">직급</th>
								<th className="p-3 font-medium">재직상태</th>
								<th className="p-3 font-medium">입사일</th>
							</tr>
						</thead>
						<tbody>
							{employees.map((employee) => (
								<tr key={employee.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3">{employee.employeeNumber}</td>
									<td className="p-3">{employee.name}</td>
									<td className="p-3">{employee.departmentName}</td>
									<td className="p-3">{employee.positionName}</td>
									<td className="p-3">
										<StatusBadge status={employee.employmentStatus} />
									</td>
									<td className="p-3">{employee.hireDate}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-4 flex items-center justify-between text-sm text-slate-500">
						<span>총 {employees.length}건</span>
						<div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f1730] text-xs font-medium text-white">
							1
						</div>
					</div>
				</>
			)}
		</div>
	);
}
