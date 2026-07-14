"use client";

import { useEffect, useState } from "react";
import { approveAppointment, listAppointments, rejectAppointment } from "@/lib/api/appointments";
import type { Appointment, AppointmentType } from "@/lib/types/appointment";

const TYPE_LABELS: Record<AppointmentType, string> = {
	HIRE: "임용",
	PROMOTION: "승진",
	TRANSFER: "전보",
	CONCURRENT: "겸임",
};

export default function AppointmentsPage() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [loading, setLoading] = useState(true);
	const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

	function load() {
		setLoading(true);
		listAppointments()
			.then((page) => {
				setAppointments(page.content);
				setTotalElements(page.totalElements);
				if (page.content.length > 0) {
					setSelectedAppt(page.content[0]);
				}
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load();
	}, []);

	async function decide(id: number, action: "approve" | "reject") {
		try {
			if (action === "approve") await approveAppointment(id);
			else await rejectAppointment(id);
			load();
		} catch (err: any) {
			alert("처리에 실패했습니다.");
		}
	}

	const getTypePill = (type: AppointmentType) => {
		if (type === "HIRE") return <span className="pill green">임용</span>;
		if (type === "PROMOTION") return <span className="pill green">승진</span>;
		if (type === "TRANSFER") return <span className="pill blue">전보</span>;
		return <span className="pill gray">{TYPE_LABELS[type] || type}</span>;
	};

	const getStatusPill = (status: string) => {
		if (status === "APPROVED") return <span className="pill green">승인완료</span>;
		if (status === "PENDING") return <span className="pill amber">승인대기</span>;
		if (status === "REJECTED") return <span className="pill red">반려</span>;
		return <span className="pill gray">{status}</span>;
	};

	const formatChanges = (appt: Appointment) => {
		if (appt.appointmentType === "PROMOTION") {
			return `${appt.fromPositionName ?? "-"} → ${appt.toPositionName ?? "-"}`;
		}
		if (appt.appointmentType === "TRANSFER") {
			return `${appt.fromDepartmentName ?? "-"} → ${appt.toDepartmentName ?? "-"}`;
		}
		return `${appt.toDepartmentName ?? "-"} / ${appt.toPositionName ?? "-"}`;
	};

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">발령 등록·승인</div>
					<div className="page-sub">전보·승진·겸임 등 인사발령 건을 등록하고 승인합니다</div>
				</div>
				<button className="btn-primary">+ 발령 등록</button>
			</div>

			<div className="stat-grid">
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">이번달 발령</span></div>
					<div className="stat-value">{totalElements}<span>건</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">승인 대기</span><span className="badge new">대기</span></div>
					<div className="stat-value">{appointments.filter(a => a.approvalStatus === "PENDING").length}<span>건</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">승인 완료</span></div>
					<div className="stat-value">{appointments.filter(a => a.approvalStatus === "APPROVED").length}<span>건</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">반려</span></div>
					<div className="stat-value">{appointments.filter(a => a.approvalStatus === "REJECTED").length}<span>건</span></div>
				</div>
			</div>

			<div className="split">
				<div className="card">
					<div className="card-head">
						<div className="card-title">발령 목록</div>
						<div className="head-actions">
							<button className="btn-ghost">필터</button>
							<button className="btn-ghost">내보내기</button>
						</div>
					</div>
					<table>
						<thead>
							<tr>
								<th>발령번호</th>
								<th>대상자 / 발령내용</th>
								<th>구분</th>
								<th>발령일</th>
								<th>상태</th>
							</tr>
						</thead>
						<tbody>
							{appointments.map((appt) => (
								<tr key={appt.id} onClick={() => setSelectedAppt(appt)} style={{cursor: 'pointer'}}>
									<td className="mono">{appt.documentNumber}</td>
									<td>
										<div className="cell-person">
											<div className="avatar-sm">{appt.employeeName.slice(0, 1)}</div>
											<div>
												<div className="p-name">{appt.employeeName}</div>
												<div className="p-sub">{formatChanges(appt)}</div>
											</div>
										</div>
									</td>
									<td>{getTypePill(appt.appointmentType)}</td>
									<td className="mono">{appt.appointmentDate}</td>
									<td>{getStatusPill(appt.approvalStatus)}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="table-foot">
						<span className="foot-info">전체 {totalElements}건 중 1–{appointments.length}건 표시</span>
						<div className="pager">
							<span className="cur">1</span>
						</div>
					</div>
				</div>

				{selectedAppt && (
					<div className="card">
						<div className="panel">
							<div className="panel-eyebrow">발령 상세 미리보기</div>
							<div className="panel-avatar">{selectedAppt.employeeName.slice(0, 1)}</div>
							<div className="panel-name">{selectedAppt.employeeName}</div>
							<div className="panel-role">{TYPE_LABELS[selectedAppt.appointmentType]} · {selectedAppt.approvalStatus === 'PENDING' ? '승인 대기' : (selectedAppt.approvalStatus === 'APPROVED' ? '승인 완료' : '반려됨')}</div>
							
							<div className="field-row">
								<span className="field-label">발령번호</span>
								<span className="field-value mono">{selectedAppt.documentNumber}</span>
							</div>
							<div className="field-row">
								<span className="field-label">발령 전</span>
								<span className="field-value">{selectedAppt.fromDepartmentName || "-"} / {selectedAppt.fromPositionName || "-"}</span>
							</div>
							<div className="field-row">
								<span className="field-label">발령 후</span>
								<span className="field-value">{selectedAppt.toDepartmentName || "-"} / {selectedAppt.toPositionName || "-"}</span>
							</div>
							<div className="field-row">
								<span className="field-label">발령일</span>
								<span className="field-value mono">{selectedAppt.appointmentDate}</span>
							</div>
							
							<div className="mini-stats">
								<div className="mini-stat"><div className="mini-stat-label">등록자</div><div className="mini-stat-value text-sm font-bold" style={{fontSize: '11px'}}>{selectedAppt.registeredByName || "시스템"}</div></div>
								<div className="mini-stat"><div className="mini-stat-label">첨부</div><div className="mini-stat-value text-sm font-bold" style={{fontSize: '11px'}}>0건</div></div>
								<div className="mini-stat"><div className="mini-stat-label">경과일</div><div className="mini-stat-value text-sm font-bold" style={{fontSize: '11px'}}>-</div></div>
							</div>
							
							{selectedAppt.approvalStatus === "PENDING" ? (
								<div className="flex gap-2 mt-4" style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
									<button className="btn-primary" style={{flex: 1, justifyContent: 'center'}} onClick={() => decide(selectedAppt.id, "approve")}>
										승인 처리
									</button>
									<button className="btn-outline" style={{flex: 1, border: '1px solid #DC2626', color: '#DC2626'}} onClick={() => decide(selectedAppt.id, "reject")}>
										반려
									</button>
								</div>
							) : (
								<div style={{marginTop: '16px'}}>
									<button className="btn-outline" style={{width: '100%', border: '1px solid #E5E8EE', color: '#9AA3B2', cursor: 'not-allowed'}} disabled>
										결재 완료됨 ({selectedAppt.approverName || "시스템"})
									</button>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}
