"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEmployee } from "@/lib/api/employees";
import { getCareers, getCertifications, getEducations } from "@/lib/api/records";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import type { Career, Certification, Education, Employee } from "@/lib/types/employee";

const CATEGORY_LABEL: Record<string, string> = { FACULTY: "교원", STAFF: "직원" };
const TABS = ["학력", "경력", "자격증"] as const;
type Tab = (typeof TABS)[number];

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
	return (
		<div className="flex gap-2 py-1.5 text-sm">
			<span className="w-24 shrink-0 text-slate-500">{label}</span>
			<span className="text-slate-900">{value ?? "-"}</span>
		</div>
	);
}

export default function EmployeeDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const employeeId = Number(params.id);

	const [employee, setEmployee] = useState<Employee | null>(null);
	const [tab, setTab] = useState<Tab>("학력");
	const [educations, setEducations] = useState<Education[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);
	const [certifications, setCertifications] = useState<Certification[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!employeeId) return;
		getEmployee(employeeId)
			.then(setEmployee)
			.catch((err) => setError(err instanceof ApiError ? err.message : "인사기록을 불러오지 못했습니다."));
		getEducations(employeeId).then(setEducations).catch(() => setEducations([]));
		getCareers(employeeId).then(setCareers).catch(() => setCareers([]));
		getCertifications(employeeId).then(setCertifications).catch(() => setCertifications([]));
	}, [employeeId]);

	if (error) return <p className="text-sm text-red-600">{error}</p>;
	if (!employee) return <p className="text-sm text-slate-500">불러오는 중...</p>;

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				인사기록 관리 <span className="mx-1">›</span> 인사정보관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">인사기록카드</span>
			</nav>

			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">
						{employee.name}{" "}
						<span className="text-base font-normal text-slate-500">({employee.employeeNumber})</span>
					</h1>
					<p className="mt-1 text-sm text-slate-500">인사기록카드</p>
				</div>
				<Button variant="outline" onClick={() => router.push("/employees")}>목록으로</Button>
			</div>

			{/* 기본 인적사항 */}
			<div className="mb-6 grid grid-cols-2 gap-x-8 rounded-lg border border-slate-200 p-6">
				<div>
					<InfoRow label="구분" value={CATEGORY_LABEL[employee.staffCategory]} />
					<InfoRow label="소속" value={employee.departmentName} />
					<InfoRow label="직급" value={employee.positionName} />
					<InfoRow label="임용구분" value={employee.employmentTypeName} />
					<div className="flex gap-2 py-1.5 text-sm">
						<span className="w-24 shrink-0 text-slate-500">재직상태</span>
						<StatusBadge status={employee.employmentStatus} />
					</div>
				</div>
				<div>
					<InfoRow label="이메일" value={employee.email} />
					<InfoRow label="연락처" value={employee.phone} />
					<InfoRow label="생년월일" value={employee.birthDate} />
					<InfoRow label="임용일" value={employee.hireDate} />
					<InfoRow label="주소" value={employee.address} />
				</div>
			</div>

			{/* 탭 */}
			<div className="mb-4 flex gap-1 border-b border-slate-200">
				{TABS.map((t) => (
					<button
						key={t}
						onClick={() => setTab(t)}
						className={`border-b-2 px-4 py-2 text-sm ${
							tab === t
								? "border-blue-600 font-semibold text-blue-600"
								: "border-transparent text-slate-500 hover:text-slate-900"
						}`}
					>
						{t}
					</button>
				))}
			</div>

			{tab === "학력" && (
				<Table
					headers={["학교명", "전공", "학위", "졸업일", "상태"]}
					rows={educations.map((e) => [e.schoolName, e.major, e.degree, e.graduationDate, e.status])}
				/>
			)}
			{tab === "경력" && (
				<Table
					headers={["기관/회사", "부서", "직위", "시작일", "종료일"]}
					rows={careers.map((c) => [c.companyName, c.department, c.position, c.startDate, c.endDate])}
				/>
			)}
			{tab === "자격증" && (
				<Table
					headers={["자격증명", "발급기관", "자격번호", "취득일", "만료일"]}
					rows={certifications.map((c) => [c.name, c.issuer, c.certNumber, c.acquiredDate, c.expiryDate])}
				/>
			)}
		</div>
	);
}

function Table({ headers, rows }: { headers: string[]; rows: (string | null)[][] }) {
	return (
		<table className="w-full border-collapse text-sm">
			<thead>
				<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
					{headers.map((h) => (
						<th key={h} className="p-3 font-medium">{h}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.length === 0 ? (
					<tr>
						<td colSpan={headers.length} className="p-6 text-center text-slate-400">
							등록된 정보가 없습니다.
						</td>
					</tr>
				) : (
					rows.map((row, i) => (
						<tr key={i} className="border-b border-slate-100">
							{row.map((cell, j) => (
								<td key={j} className="p-3">{cell ?? "-"}</td>
							))}
						</tr>
					))
				)}
			</tbody>
		</table>
	);
}
