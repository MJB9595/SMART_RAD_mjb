"use client";

import { useEffect, useState } from "react";
import { listAttendances, getAttendanceSummary } from "@/lib/api/attendance";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Input } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import type { Attendance, AttendanceSummary } from "@/lib/types/attendance";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
	const [workDate, setWorkDate] = useState(today());
	const [attendances, setAttendances] = useState<Attendance[]>([]);
	const [summary, setSummary] = useState<AttendanceSummary | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	function load(date: string) {
		setLoading(true);
		setError(null);
		Promise.all([listAttendances(date), getAttendanceSummary(date)])
			.then(([list, summaryData]) => {
				setAttendances(list);
				setSummary(summaryData);
			})
			.catch((err) => setError(err instanceof ApiError ? err.message : "근태 현황을 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load(workDate);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				근태관리 <span className="mx-1">›</span> <span className="font-medium text-slate-900">일일근태등록</span>
			</nav>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">일일근태등록</h1>
				<p className="mt-1 text-sm text-slate-500">날짜별 출근 현황을 조회하고 등록합니다.</p>
			</div>

			<div className="mb-6 rounded-lg border border-slate-200 p-6">
				<p className="mb-4 text-sm font-semibold text-slate-700">검색조건</p>
				<div className="flex items-end gap-4">
					<Field label="근무일">
						<Input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
					</Field>
					<Button variant="primary" onClick={() => load(workDate)}>
						조회
					</Button>
				</div>
			</div>

			{summary && (
				<div className="mb-6 grid grid-cols-4 gap-4">
					{[
						{ label: "출근", value: summary.present },
						{ label: "지각", value: summary.late },
						{ label: "결근", value: summary.absent },
						{ label: "연차", value: summary.annualLeave },
					].map((stat) => (
						<div key={stat.label} className="rounded-lg border border-slate-200 p-4">
							<p className="text-sm text-slate-500">{stat.label}</p>
							<p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
						</div>
					))}
				</div>
			)}

			{loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && !error && (
				<>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
								<th className="p-3 font-medium">사원번호</th>
								<th className="p-3 font-medium">이름</th>
								<th className="p-3 font-medium">출근시간</th>
								<th className="p-3 font-medium">퇴근시간</th>
								<th className="p-3 font-medium">상태</th>
							</tr>
						</thead>
						<tbody>
							{attendances.map((a) => (
								<tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3">{a.employeeNumber}</td>
									<td className="p-3">{a.employeeName}</td>
									<td className="p-3">{a.checkInTime ?? "-"}</td>
									<td className="p-3">{a.checkOutTime ?? "-"}</td>
									<td className="p-3">
										<StatusBadge status={a.status} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-4 text-sm text-slate-500">총 {attendances.length}건</div>
				</>
			)}
		</div>
	);
}
