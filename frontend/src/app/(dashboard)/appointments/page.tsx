"use client";

import { useEffect, useState } from "react";
import { approveAppointment, listAppointments, rejectAppointment, createAppointment } from "@/lib/api/appointments";
import type { Appointment, AppointmentType } from "@/lib/types/appointment";
import { searchEmployees } from "@/lib/api/employees";
import { listDepartments } from "@/lib/api/departments";
import { listPositions } from "@/lib/api/meta";
import type { Employee } from "@/lib/types/employee";
import type { Department } from "@/lib/types/department";
import type { Position } from "@/lib/types/meta";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthContext";
import { isAdminOrHr, canApproveTarget } from "@/lib/auth/permissions";

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

	const { user } = useAuth();
	const isAdmin = isAdminOrHr(user);

	// Registration Modal State
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [positions, setPositions] = useState<Position[]>([]);
	const [form, setForm] = useState({
		employeeId: "",
		appointmentType: "TRANSFER" as AppointmentType,
		fromDepartmentId: "",
		toDepartmentId: "",
		fromPositionId: "",
		toPositionId: "",
		appointmentDate: new Date().toISOString().split('T')[0],
		reason: ""
	});

	useEffect(() => {
		searchEmployees({ size: 1000 }).then(p => setEmployees(p.content)).catch(console.error);
		listDepartments().then(setDepartments).catch(console.error);
		listPositions().then(setPositions).catch(console.error);
	}, []);

	// 현재 선택된 직원 (발령 전 소속·직급 표시용)
	const selectedEmployee = employees.find((e) => String(e.id) === form.employeeId);

	/** 대상 직원을 고르면 '이전 소속·직급'에 그 직원의 현재 값을 자동 반영한다. */
	const handleEmployeeChange = (employeeId: string) => {
		const emp = employees.find((e) => String(e.id) === employeeId);
		setForm((f) => ({
			...f,
			employeeId,
			fromDepartmentId: emp ? String(emp.departmentId) : "",
			fromPositionId: emp ? String(emp.positionId) : "",
			// 발령 후 값은 '변함없음'으로 초기화 — 실제로 바뀌는 항목만 선택하면 된다.
			toDepartmentId: "",
			toPositionId: "",
		}));
	};

	const handleCreateSubmit = async () => {
		if (!form.employeeId || !form.appointmentDate) {
			alert("사원과 발령일자는 필수입니다.");
			return;
		}
		// 소속·직급 모두 '변함없음'이면 실제로 바뀌는 것이 없다.
		if (!form.toDepartmentId && !form.toPositionId) {
			alert("발령 소속 또는 발령 직급 중 최소 하나는 선택해야 합니다.\n(둘 다 '변함없음'이면 변경 사항이 없습니다)");
			return;
		}
		try {
			await createAppointment({
				employeeId: Number(form.employeeId),
				appointmentType: form.appointmentType,
				fromDepartmentId: form.fromDepartmentId ? Number(form.fromDepartmentId) : null,
				toDepartmentId: form.toDepartmentId ? Number(form.toDepartmentId) : null,
				fromPositionId: form.fromPositionId ? Number(form.fromPositionId) : null,
				toPositionId: form.toPositionId ? Number(form.toPositionId) : null,
				appointmentDate: form.appointmentDate,
				reason: form.reason
			});
			alert("발령 등록이 완료되었습니다.");
			setIsModalOpen(false);
			load();
		} catch (err: any) {
			alert(err.message || "등록에 실패했습니다.");
		}
	};

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
				{isAdmin && (
					<button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ 발령 등록</button>
				)}
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

				{selectedAppt ? (
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
								<div className="flex gap-2 mt-4" style={{display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px'}}>
									<button className="btn-primary" style={{flex: 1, justifyContent: 'center'}} onClick={() => decide(selectedAppt.id, "approve")}>
										승인 처리
									</button>
									<button className="btn-outline" style={{flex: 1, border: '1px solid #DC2626', color: '#DC2626'}} onClick={() => decide(selectedAppt.id, "reject")}>
										반려
									</button>
								</div>
							) : (
								<div style={{marginTop: 'auto', paddingTop: '16px'}}>
									<button className="btn-outline" style={{width: '100%', border: '1px solid #E5E8EE', color: '#9AA3B2', cursor: 'not-allowed'}} disabled>
										결재 완료됨 ({selectedAppt.approverName || "시스템"})
									</button>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="card">
						<div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-center h-full min-h-[400px]">
							<div className="text-4xl mb-4 opacity-50">📄</div>
							<div className="text-[14px] font-bold text-slate-600 mb-1.5">발령 건을 선택해주세요</div>
							<div className="text-[12.5px] leading-relaxed">좌측 목록에서 내역을 클릭하면<br/>상세 정보와 결재 버튼이 표시됩니다.</div>
						</div>
					</div>
				)}
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
						<div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
							<h2 className="text-lg font-bold text-slate-900 tracking-tight">발령 등록하기</h2>
							<button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
							</button>
						</div>
						<div className="p-6 space-y-4 overflow-y-auto">
							<div className="space-y-1.5">
								<label className="text-sm font-bold text-slate-700">대상 직원</label>
								<select
									value={form.employeeId}
									onChange={(e) => handleEmployeeChange(e.target.value)}
									className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
								>
									<option value="">직원을 선택하세요</option>
									{employees.map(emp => (
										<option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeNumber})</option>
									))}
								</select>
								{selectedEmployee && (
									<p className="text-xs font-medium text-indigo-600">
										현재 소속·직급: {selectedEmployee.departmentName} / {selectedEmployee.positionName} — 아래 &lsquo;이전&rsquo; 항목에 자동 반영되었습니다.
									</p>
								)}
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-bold text-slate-700">발령 구분</label>
								<select 
									value={form.appointmentType} 
									onChange={(e) => setForm({...form, appointmentType: e.target.value as AppointmentType})}
									className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
								>
									<option value="HIRE">임용</option>
									<option value="PROMOTION">승진</option>
									<option value="TRANSFER">전보</option>
									<option value="CONCURRENT">겸임</option>
								</select>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700">
										이전 소속 <span className="text-xs font-medium text-slate-400">(자동)</span>
									</label>
									<select
										value={form.fromDepartmentId}
										onChange={(e) => setForm({...form, fromDepartmentId: e.target.value})}
										className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
									>
										<option value="">(직원 선택 시 자동)</option>
										{departments.map(d => (
											<option key={d.id} value={d.id}>{d.name}</option>
										))}
									</select>
								</div>
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700">발령 소속</label>
									<select
										value={form.toDepartmentId}
										onChange={(e) => setForm({...form, toDepartmentId: e.target.value})}
										className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
									>
										<option value="">변함없음 (현 소속 유지)</option>
										{departments.map(d => (
											<option key={d.id} value={d.id}>{d.name}</option>
										))}
									</select>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700">
										이전 직급 <span className="text-xs font-medium text-slate-400">(자동)</span>
									</label>
									<select
										value={form.fromPositionId}
										onChange={(e) => setForm({...form, fromPositionId: e.target.value})}
										className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
									>
										<option value="">(직원 선택 시 자동)</option>
										{positions.map(p => (
											<option key={p.id} value={p.id}>{p.name}</option>
										))}
									</select>
								</div>
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700">발령 직급</label>
									<select
										value={form.toPositionId}
										onChange={(e) => setForm({...form, toPositionId: e.target.value})}
										className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
									>
										<option value="">변함없음 (현 직급 유지)</option>
										{positions.map(p => (
											<option key={p.id} value={p.id}>{p.name}</option>
										))}
									</select>
								</div>
							</div>
							<p className="text-xs text-slate-500 -mt-1">
								바뀌는 항목만 고르면 됩니다. 예) 승진 → 발령 소속은 <b>변함없음</b>, 발령 직급만 선택
							</p>
							<div className="space-y-1.5">
								<label className="text-sm font-bold text-slate-700">발령 일자</label>
								<input 
									type="date" 
									value={form.appointmentDate} 
									onChange={(e) => setForm({...form, appointmentDate: e.target.value})}
									className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-bold text-slate-700">사유</label>
								<textarea 
									rows={2} 
									value={form.reason} 
									onChange={(e) => setForm({...form, reason: e.target.value})}
									placeholder="발령 사유를 자세히 입력하세요" 
									className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors"
								></textarea>
							</div>
						</div>
						<div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end shrink-0">
							<Button variant="outline" onClick={() => setIsModalOpen(false)} className="text-slate-600 hover:bg-slate-200 font-semibold px-5 rounded-lg h-10 border-slate-300">
								취소
							</Button>
							<Button variant="primary" onClick={handleCreateSubmit} className="font-bold px-6 rounded-lg h-10 shadow-sm">
								발령 등록하기
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
