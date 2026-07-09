"use client";

import { useEffect, useMemo, useState } from "react";
import { listAppointments } from "@/lib/api/appointments";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Input, Select } from "@/components/ui";
import type { Appointment, AppointmentType } from "@/lib/types/appointment";

const TYPE_LABELS: Record<AppointmentType, string> = {
	PROMOTION: "승진",
	TRANSFER: "전보",
	CONCURRENT: "겸직",
};

export default function AppointmentsPage() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [keyword, setKeyword] = useState("");
	const [type, setType] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listAppointments()
			.then(setAppointments)
			.catch((err) => setError(err instanceof ApiError ? err.message : "발령 목록을 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	const filtered = useMemo(
		() =>
			appointments.filter(
				(a) =>
					(!keyword || a.employeeName.includes(keyword) || a.employeeNumber.includes(keyword)) &&
					(!type || a.appointmentType === type),
			),
		[appointments, keyword, type],
	);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				인사관리 <span className="mx-1">›</span> 인사정보 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">인사발령등록</span>
			</nav>

			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">인사발령등록</h1>
					<p className="mt-1 text-sm text-slate-500">승진·전보·겸직 등 인사발령 이력을 관리합니다.</p>
				</div>
				<div className="flex gap-2">
					<Button variant="primary">발령 등록</Button>
				</div>
			</div>

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex flex-wrap items-end gap-4">
					<Field label="대상자">
						<Input
							placeholder="이름 또는 사원번호 입력"
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						/>
					</Field>
					<Field label="발령구분">
						<Select value={type} onChange={(e) => setType(e.target.value)}>
							<option value="">전체</option>
							<option value="PROMOTION">승진</option>
							<option value="TRANSFER">전보</option>
							<option value="CONCURRENT">겸직</option>
						</Select>
					</Field>
				</div>
			</div>

			{loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && !error && (
				<>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
								<th className="p-3 font-medium">발령번호</th>
								<th className="p-3 font-medium">대상자</th>
								<th className="p-3 font-medium">발령구분</th>
								<th className="p-3 font-medium">이전 부서/직급</th>
								<th className="p-3 font-medium">이후 부서/직급</th>
								<th className="p-3 font-medium">발령일자</th>
								<th className="p-3 font-medium">등록자</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((a) => (
								<tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3">{a.documentNumber}</td>
									<td className="p-3">{a.employeeName}</td>
									<td className="p-3">{TYPE_LABELS[a.appointmentType]}</td>
									<td className="p-3">
										{a.fromDepartmentName ?? "-"} / {a.fromPositionName ?? "-"}
									</td>
									<td className="p-3">
										{a.toDepartmentName ?? "-"} / {a.toPositionName ?? "-"}
									</td>
									<td className="p-3">{a.appointmentDate}</td>
									<td className="p-3">{a.registeredByName}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-4 text-sm text-slate-500">총 {filtered.length}건</div>
				</>
			)}
		</div>
	);
}
