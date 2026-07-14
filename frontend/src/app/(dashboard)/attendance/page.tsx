"use client";

import { useEffect, useState } from "react";
import { listAttendances, getAttendanceSummary } from "@/lib/api/attendance";
import type { Attendance, AttendanceSummary } from "@/lib/types/attendance";

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
	const [workDate, setWorkDate] = useState(today());
	const [attendances, setAttendances] = useState<Attendance[]>([]);
	const [summary, setSummary] = useState<AttendanceSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);

	function load(date: string) {
		setLoading(true);
		Promise.all([listAttendances(date), getAttendanceSummary(date)])
			.then(([list, summaryData]) => {
				setAttendances(list);
				setSummary(summaryData);
				if (list.length > 0) {
					setSelectedRecord(list[0]);
				}
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load(workDate);
	}, [workDate]);

	const getStatusPill = (status: string) => {
		if (status === "PRESENT") return <span className="pill green">출근</span>;
		if (status === "LATE") return <span className="pill amber">지각</span>;
		if (status === "EARLY_LEAVE") return <span className="pill amber">조퇴</span>;
		if (status === "ABSENT") return <span className="pill red">결근</span>;
		if (status === "LEAVE") return <span className="pill blue">휴가</span>;
		return <span className="pill gray">{status}</span>;
	};

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">휴가 신청·승인</div>
					<div className="page-sub">출퇴근 현황과 휴가 신청 내역을 확인하고 승인합니다</div>
				</div>
				<button className="btn-primary">+ 휴가 신청 등록</button>
			</div>

			<div className="stat-grid">
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">오늘 출근</span></div>
					<div className="stat-value">{summary?.present || 0}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">지각·조퇴</span></div>
					<div className="stat-value">{summary?.late || 0}<span>건</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">휴가 사용중</span></div>
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
							<button className="btn-ghost">내보내기</button>
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
							{attendances.map((a) => (
								<tr key={a.id} onClick={() => setSelectedRecord(a)} style={{cursor: 'pointer'}}>
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
							))}
						</tbody>
					</table>
					<div className="table-foot">
						<span className="foot-info">전체 {attendances.length}건</span>
						<div className="pager">
							<span className="cur">1</span>
						</div>
					</div>
				</div>

				{selectedRecord && (
					<div className="card">
						<div className="panel">
							<div className="panel-eyebrow">잔여일수 대시보드</div>
							<div className="panel-avatar">{selectedRecord.employeeName.slice(0, 1)}</div>
							<div className="panel-name">{selectedRecord.employeeName}</div>
							<div className="panel-role">{selectedRecord.employeeNumber}</div>
							
							<div className="field-row">
								<span className="field-label">연차 발생</span>
								<span className="field-value mono">15일</span>
							</div>
							<div className="field-row">
								<span className="field-label">사용</span>
								<span className="field-value mono">0일</span>
							</div>
							<div className="field-row">
								<span className="field-label">잔여</span>
								<span className="field-value mono">15일</span>
							</div>
							
							<div className="mini-stats">
								<div className="mini-stat"><div className="mini-stat-label">이월</div><div className="mini-stat-value">0일</div></div>
								<div className="mini-stat"><div className="mini-stat-label">보상휴가</div><div className="mini-stat-value">0일</div></div>
								<div className="mini-stat"><div className="mini-stat-label">병가</div><div className="mini-stat-value">0일</div></div>
							</div>
							
							<button className="btn-outline">휴가 이력 보기</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
