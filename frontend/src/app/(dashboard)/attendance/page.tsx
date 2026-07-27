"use client";

import { useEffect, useState } from "react";
import { listAttendances, getAttendanceSummary, createAttendance } from "@/lib/api/attendance";
import { searchEmployees } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";
import type { Attendance, AttendanceSummary } from "@/lib/types/attendance";
import type { Employee } from "@/lib/types/employee";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
	const [workDate, setWorkDate] = useState(today());
	const [attendances, setAttendances] = useState<Attendance[]>([]);
	const [summary, setSummary] = useState<AttendanceSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);

	// 등록 폼
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [empId, setEmpId] = useState("");
	const [status, setStatus] = useState("PRESENT");
	const [checkIn, setCheckIn] = useState("09:00");
	const [checkOut, setCheckOut] = useState("18:00");
	const [saving, setSaving] = useState(false);

	function load(date: string) {
		setLoading(true);
		Promise.all([listAttendances(date), getAttendanceSummary(date)])
			.then(([list, summaryData]) => {
				setAttendances(list);
				setSummary(summaryData);
				setSelectedRecord(list.length > 0 ? list[0] : null);
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load(workDate);
	}, [workDate]);

	useEffect(() => {
		searchEmployees({ size: 200 })
			.then((res) => setEmployees(res.content))
			.catch(() => setEmployees([]));
	}, []);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!empId) {
			alert("대상 교직원을 선택하세요.");
			return;
		}
		const leave = status === "ANNUAL_LEAVE";
		setSaving(true);
		try {
			await createAttendance({
				employeeId: Number(empId),
				workDate,
				checkInTime: leave ? null : checkIn || null,
				checkOutTime: leave ? null : checkOut || null,
				status,
			});
			setShowForm(false);
			setEmpId("");
			setStatus("PRESENT");
			load(workDate);
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "근태 등록에 실패했습니다.");
		} finally {
			setSaving(false);
		}
	}

	const getStatusPill = (status: string) => {
		if (status === "PRESENT") return <span className="pill green">출근</span>;
		if (status === "LATE") return <span className="pill amber">지각</span>;
		if (status === "ABSENT") return <span className="pill red">결근</span>;
		if (status === "ANNUAL_LEAVE") return <span className="pill blue">연차</span>;
		return <span className="pill gray">{status}</span>;
	};

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">일일 근태 관리</div>
					<div className="page-sub">일자별 출퇴근 현황을 등록·조회합니다</div>
				</div>
				<button className="btn-primary" onClick={() => setShowForm(true)}>+ 근태 등록</button>
			</div>

			<div className="stat-grid">
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">출근</span></div>
					<div className="stat-value">{summary?.present || 0}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">지각</span></div>
					<div className="stat-value">{summary?.late || 0}<span>건</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">연차</span></div>
					<div className="stat-value">{summary?.annualLeave || 0}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">결근</span><span className="badge down">주의</span></div>
					<div className="stat-value">{summary?.absent || 0}<span>명</span></div>
				</div>
			</div>

			<div className="split">
				<div className="card">
					<div className="card-head">
						<div className="card-title">출퇴근 현황 ({workDate})</div>
						<div className="head-actions">
							<input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-1 text-sm outline-none text-slate-700 font-mono" />
						</div>
					</div>
					<table>
						<thead>
							<tr>
								<th>대상자</th>
								<th>상태</th>
								<th>출근시간</th>
								<th>퇴근시간</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr className="empty-row"><td colSpan={4}>불러오는 중...</td></tr>
							) : attendances.length === 0 ? (
								<tr className="empty-row"><td colSpan={4}>{workDate} 근태 기록이 없습니다.</td></tr>
							) : (
								attendances.map((a) => (
									<tr key={a.id} onClick={() => setSelectedRecord(a)} style={{ cursor: "pointer" }}>
										<td>
											<div className="cell-person">
												<div className="avatar-sm">{a.employeeName.slice(0, 1)}</div>
												<div>
													<div className="p-name">{a.employeeName}</div>
													<div className="p-sub mono">{a.employeeNumber}</div>
												</div>
											</div>
										</td>
										<td>{getStatusPill(a.status)}</td>
										<td className="mono">{a.checkInTime ?? "-"}</td>
										<td className="mono">{a.checkOutTime ?? "-"}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
					<div className="table-foot">
						<span className="foot-info">전체 {attendances.length}건</span>
					</div>
				</div>

				{selectedRecord && (
					<div className="card">
						<div className="panel">
							<div className="panel-eyebrow">근태 상세</div>
							<div className="panel-avatar">{selectedRecord.employeeName.slice(0, 1)}</div>
							<div className="panel-name">{selectedRecord.employeeName}</div>
							<div className="panel-role">{selectedRecord.employeeNumber}</div>
							<div className="field-row">
								<span className="field-label">근무일</span>
								<span className="field-value mono">{selectedRecord.workDate}</span>
							</div>
							<div className="field-row">
								<span className="field-label">상태</span>
								<span className="field-value">{getStatusPill(selectedRecord.status)}</span>
							</div>
							<div className="field-row">
								<span className="field-label">출근</span>
								<span className="field-value mono">{selectedRecord.checkInTime ?? "-"}</span>
							</div>
							<div className="field-row">
								<span className="field-label">퇴근</span>
								<span className="field-value mono">{selectedRecord.checkOutTime ?? "-"}</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{showForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
					<form onSubmit={submit} className="w-[420px] max-w-[95vw] rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-bold text-slate-900">근태 등록 <span className="text-sm font-normal text-slate-400">({workDate})</span></h2>
							<button type="button" onClick={() => setShowForm(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-600">&times;</button>
						</div>
						<div className="space-y-3">
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">대상 교직원</label>
								<select value={empId} onChange={(e) => setEmpId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" required>
									<option value="">교직원 선택</option>
									{employees.map((emp) => (
										<option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeNumber})</option>
									))}
								</select>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">상태</label>
								<select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
									<option value="PRESENT">출근</option>
									<option value="LATE">지각</option>
									<option value="ABSENT">결근</option>
									<option value="ANNUAL_LEAVE">연차</option>
								</select>
							</div>
							{status !== "ANNUAL_LEAVE" && status !== "ABSENT" && (
								<div className="flex gap-3">
									<div className="flex-1">
										<label className="mb-1 block text-sm font-medium text-slate-700">출근시간</label>
										<input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
									</div>
									<div className="flex-1">
										<label className="mb-1 block text-sm font-medium text-slate-700">퇴근시간</label>
										<input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
									</div>
								</div>
							)}
						</div>
						<div className="mt-5 flex justify-end gap-2">
							<button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">취소</button>
							<button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "등록 중..." : "등록"}</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
}
