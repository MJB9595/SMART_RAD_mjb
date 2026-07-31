"use client";

import { useEffect, useState } from "react";
import { listAttendances, getAttendanceSummary, createAttendance } from "@/lib/api/attendance";
import { listSelectableEmployees } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";
import type { Attendance, AttendanceSummary } from "@/lib/types/attendance";
import type { SelectableEmployee } from "@/lib/types/employee";
import { useAuth } from "@/lib/auth/AuthContext";
import { useFeedback } from "@/components/feedback/FeedbackProvider";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
	const { notify, confirm: askConfirm } = useFeedback();
	const { user } = useAuth();
	const [workDate, setWorkDate] = useState(today());
	/**
	 * 조회 날짜가 곧 등록 날짜다. 지난 날짜는 서버가 거부하므로 등록 버튼을 잠근다.
	 * 단 관리자·인사팀은 사후 정정을 위해 서버에서도 허용하므로 잠그지 않는다.
	 * (조회는 과거도 자유롭게 할 수 있어야 하니 날짜 선택 자체는 막지 않는다)
	 */
	const canBackdate = user?.role === "ADMIN" || user?.role === "HR";
	const isPastDate = workDate < today() && !canBackdate;
	const [attendances, setAttendances] = useState<Attendance[]>([]);
	const [summary, setSummary] = useState<AttendanceSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);

	// 등록 폼
	const [employees, setEmployees] = useState<SelectableEmployee[]>([]);
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
			.catch(() => notify("근태 내역을 불러오지 못했습니다.", "error"))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load(workDate);
	}, [workDate]);

	useEffect(() => {
		if (!user) return;
		// 이전에는 AuthUser 를 Employee 로 캐스팅해 넣어서 option 의 value 가 undefined 였다.
		// 이제 서버가 역할별 범위를 정해 주는 목록을 그대로 쓴다.
		listSelectableEmployees()
			.then((list) => {
				setEmployees(list);
				const me = list.find((e) => e.self);
				if (me) setEmpId((prev) => prev || String(me.id));
			})
			.catch(() => setEmployees([]));
	}, [user]);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!empId) {
			notify("대상 교직원을 선택하세요.", "error");
			return;
		}
		if (isPastDate) {
			notify("지난 날짜의 근태는 등록할 수 없습니다.", "error");
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
			notify(err instanceof ApiError ? err.message : "근태 등록에 실패했습니다.", "error");
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
			<div className="title-row flex-col sm:flex-row gap-4 sm:gap-0">
				<div>
					<div className="page-title">일일 근태 관리</div>
					<div className="page-sub">일자별 출퇴근 현황을 등록·조회합니다</div>
				</div>
				<button
					className="btn-primary w-full sm:w-auto"
					onClick={() => setShowForm(true)}
					disabled={isPastDate}
					style={isPastDate ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
					title={isPastDate ? "지난 날짜의 근태는 등록할 수 없습니다. 오늘 이후 날짜를 선택하세요." : undefined}
				>
					+ 근태 등록
				</button>
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
					<div className="card-head flex-col items-start sm:flex-row sm:items-center gap-3">
						<div className="card-title w-full sm:w-auto">출퇴근 현황 ({workDate})</div>
						<div className="head-actions w-full sm:w-auto">
							<input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} className="w-full sm:w-auto border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none text-slate-700 font-mono" />
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full whitespace-nowrap min-w-[500px] hidden lg:table">
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
								attendances.map((a) => {
									// 전체를 보는 인사팀·관리자 화면에서 본인 행을 찾기 쉽도록 강조한다
									const isMine = a.employeeId === user?.employeeId;
									const isSelected = selectedRecord?.id === a.id;
									return (
									<tr key={a.id} onClick={() => setSelectedRecord(a)}
										className={`cursor-pointer transition-colors hover:bg-slate-50 ${isSelected ? "bg-indigo-50/70" : isMine ? "bg-slate-50" : ""}`}
										style={isSelected ? { boxShadow: "inset 4px 0 0 0 #1F3A8F" } : undefined}>
										<td>
											<div className="cell-person">
												<div className="avatar-sm">{a.employeeName.slice(0, 1)}</div>
												<div>
													<div className="p-name">
														{a.employeeName}
														{isMine && <span className="pill blue" style={{ marginLeft: "6px" }}>본인</span>}
													</div>
													<div className="p-sub mono">{a.employeeNumber}</div>
												</div>
											</div>
										</td>
										<td>{getStatusPill(a.status)}</td>
										<td className="mono">{a.checkInTime ?? "-"}</td>
										<td className="mono">{a.checkOutTime ?? "-"}</td>
									</tr>
									);
								})
							)}
						</tbody>
						</table>
						
						{/* Mobile Card View */}
						<div className="lg:hidden flex flex-col gap-3 p-4 bg-slate-50/50">
							{loading ? (
								<div className="text-center text-slate-400 py-8 text-sm">불러오는 중...</div>
							) : attendances.length === 0 ? (
								<div className="text-center text-slate-400 py-8 text-sm">{workDate} 근태 기록이 없습니다.</div>
							) : (
								attendances.map((a) => {
									const isMine = a.employeeId === user?.employeeId;
									const isSelected = selectedRecord?.id === a.id;
									return (
										<div key={a.id} onClick={() => setSelectedRecord(a)} className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer transition-all ${isSelected ? "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/30" : "border-slate-200"}`} style={{ borderLeft: isSelected ? "4px solid #1F3A8F" : (isMine ? "4px solid #94A3B8" : undefined) }}>
											<div className="flex justify-between items-start border-b border-slate-100 pb-3">
												<div className="flex items-center gap-3">
													<div className="avatar-sm flex-shrink-0">{a.employeeName.slice(0, 1)}</div>
													<div>
														<div className="font-bold text-slate-900 flex items-center gap-2">
															{a.employeeName}
															{isMine && <span className="pill blue text-[10px] px-1.5 py-0.5">본인</span>}
														</div>
														<div className="text-xs text-slate-400 font-mono mt-0.5">{a.employeeNumber}</div>
													</div>
												</div>
												<div className="scale-90 origin-top-right flex-shrink-0">
													{getStatusPill(a.status)}
												</div>
											</div>
											<div className="flex justify-between items-center text-sm pt-1">
												<span className="text-slate-500 font-medium">출근시간</span>
												<span className="font-mono text-slate-700">{a.checkInTime ?? "-"}</span>
											</div>
											<div className="flex justify-between items-center text-sm pb-1">
												<span className="text-slate-500 font-medium">퇴근시간</span>
												<span className="font-mono text-slate-700">{a.checkOutTime ?? "-"}</span>
											</div>
										</div>
									);
								})
							)}
						</div>
					</div>
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
										<option key={emp.id} value={emp.id}>
											{emp.self ? `${emp.name} (본인)` : emp.name} · {emp.departmentName ?? "-"} {emp.positionName ?? ""}
										</option>
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
