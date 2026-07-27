"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui";
import { listLeaveRequests, approveLeave, rejectLeave, createLeaveRequest, listLeaveTypes, type LeaveTypeModel } from "@/lib/api/leaves";
import { searchEmployees } from "@/lib/api/employees";
import type { Employee } from "@/lib/types/employee";
import { ApiError } from "@/lib/api/client";
import { StatusBadge } from "@/components/StatusBadge";
import type { LeaveRequest, LeaveBalance } from "@/lib/types/leave";

interface EmployeeLeaveData {
	id: number;
	name: string;
	requests: LeaveRequest[];
}

export default function LeavesPage() {
	const today = new Date();
	const [year, setYear] = useState(today.getFullYear().toString());
	const [month, setMonth] = useState((today.getMonth() + 1).toString().padStart(2, '0'));
	const [items, setItems] = useState<LeaveRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedEmployee, setSelectedEmployee] = useState<EmployeeLeaveData | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

	// Application form state
	const [employeeList, setEmployeeList] = useState<Employee[]>([]);
	const [leaveTypes, setLeaveTypes] = useState<LeaveTypeModel[]>([]);
	const [applyForm, setApplyForm] = useState({
		employeeId: "",
		leaveTypeId: "",
		startDate: "",
		endDate: "",
		days: "1",
		reason: ""
	});

	useEffect(() => {
		searchEmployees({ size: 100 }).then(res => setEmployeeList(res.content)).catch(console.error);
		listLeaveTypes().then(setLeaveTypes).catch(console.error);
	}, []);

	const handleApplySubmit = async () => {
		try {
			await createLeaveRequest({
				employeeId: Number(applyForm.employeeId),
				leaveTypeId: Number(applyForm.leaveTypeId),
				startDate: applyForm.startDate,
				endDate: applyForm.endDate,
				days: Number(applyForm.days),
				reason: applyForm.reason
			});
			alert("휴가 신청이 완료되었습니다.");
			setIsApplyModalOpen(false);
			load(); // Refresh list!
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "신청에 실패했습니다.");
		}
	};

	const load = useCallback(() => {
		setLoading(true);
		listLeaveRequests(500)
			.then((page) => {
				setItems(page.content);
				// If selected employee exists, update their data
				if (selectedEmployee) {
					const updated = page.content.filter(r => r.employeeId === selectedEmployee.id);
					setSelectedEmployee({ ...selectedEmployee, requests: updated });
				}
			})
			.catch((err) => {
				console.error("휴가 내역 로드 실패", err);
			})
			.finally(() => setLoading(false));
	}, [selectedEmployee]);

	useEffect(() => {
		load();
	}, []); // Initial load

	async function decide(id: number, action: "approve" | "reject") {
		try {
			if (action === "approve") await approveLeave(id);
			else await rejectLeave(id);
			load(); // Reload after decision
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "처리에 실패했습니다.");
		}
	}

	// Filter requests by current month roughly
	const currentMonthRequests = useMemo(() => {
		const monthStart = `${year}-${month.padStart(2, '0')}-01`;
		const monthEnd = `${year}-${month.padStart(2, '0')}-31`;
		return items.filter(req => req.startDate <= monthEnd && req.endDate >= monthStart);
	}, [items, year, month]);

	const employees = useMemo(() => {
		const map = new Map<number, EmployeeLeaveData>();
		currentMonthRequests.forEach(req => {
			if (!map.has(req.employeeId)) {
				map.set(req.employeeId, { id: req.employeeId, name: req.employeeName, requests: [] });
			}
			map.get(req.employeeId)!.requests.push(req);
		});
		return Array.from(map.values());
	}, [currentMonthRequests]);

	// Initialize selected employee
	useEffect(() => {
		if (employees.length > 0 && !selectedEmployee) {
			setSelectedEmployee(employees[0]);
		}
	}, [employees, selectedEmployee]);

	// Generate Days for the selected month
	const daysInMonth = useMemo(() => {
		return new Date(Number(year), Number(month), 0).getDate();
	}, [year, month]);

	const days = useMemo(() => {
		const result = [];
		const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
		for (let d = 1; d <= daysInMonth; d++) {
			const date = new Date(Number(year), Number(month) - 1, d);
			const dayIndex = date.getDay();
			result.push({
				date: d,
				dayName: weekDays[dayIndex],
				isWeekend: dayIndex === 0 || dayIndex === 6,
				isSunday: dayIndex === 0,
				isSaturday: dayIndex === 6,
				fullDate: `${year}-${month.padStart(2, '0')}-${String(d).padStart(2, '0')}`,
			});
		}
		return result;
	}, [year, month, daysInMonth]);

	const getLeaveColor = (typeName: string, status: string) => {
		if (status === 'REJECTED') return 'bg-slate-200 text-slate-700 line-through';
		if (status === 'PENDING') return 'bg-amber-100 text-amber-800';
		
		switch (typeName) {
			case '연차': return 'bg-rose-100 text-rose-800';
			case '병가': return 'bg-blue-100 text-blue-800';
			case '공가': return 'bg-emerald-100 text-emerald-800';
			case '특별휴가': return 'bg-purple-100 text-purple-800';
			case '출산/육아': return 'bg-indigo-100 text-indigo-800';
			default: return 'bg-slate-200 text-slate-800';
		}
	};

	return (
		<div className="flex flex-1 w-full gap-6 pb-4 min-h-0">
			{/* Main Grid View */}
			<div className="flex-1 flex flex-col bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm">
				{/* Header */}
				<div className="flex flex-wrap justify-between items-center p-5 border-b border-slate-200 bg-white gap-4">
					<div className="flex items-center gap-4 sm:gap-8 flex-wrap">
						<h1 className="text-[22px] font-bold text-slate-900 tracking-tight">월 휴가 관리 · 현황</h1>
					</div>
					<Button 
						variant="primary"
						onClick={() => setIsApplyModalOpen(true)}
						className="h-9 px-5 rounded-lg shadow-sm font-bold"
					>
						휴가 신청하기
					</Button>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap items-center gap-3 px-5 py-4 bg-white border-b border-slate-200">
					<div className="flex items-center border border-slate-300 rounded overflow-hidden h-[34px]">
						<input 
							type="month" 
							value={`${year}-${month}`} 
							onChange={(e) => {
								const [y, m] = e.target.value.split('-');
								if(y && m) { setYear(y); setMonth(m); }
							}}
							className="px-3 outline-none text-sm font-medium text-slate-700 bg-white w-[130px]"
						/>
					</div>
					
					<div className="flex flex-wrap items-center gap-2 sm:ml-auto">
						<select className="h-[34px] min-w-[100px] text-sm font-medium bg-slate-50 border border-slate-300 rounded px-2 outline-none text-slate-700">
							<option>전체 부서</option>
						</select>
						<select className="h-[34px] min-w-[100px] text-sm font-medium bg-slate-50 border border-slate-300 rounded px-2 outline-none text-slate-700">
							<option>승인 상태</option>
							<option>대기중</option>
							<option>승인완료</option>
						</select>
					</div>
				</div>

				{/* Table Grid */}
				<div className="flex-1 overflow-x-auto overflow-y-auto bg-white [&::-webkit-scrollbar]:h-[10px] [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
					<table className="w-full border-collapse text-xs whitespace-nowrap min-w-max bg-white">
						<thead className="sticky top-0 z-30">
							<tr className="border-b border-slate-200 bg-white">
								<th className="sticky left-0 z-40 bg-white p-3 border-r border-b border-slate-200 min-w-[100px] sm:w-[140px] shadow-[1px_0_0_rgb(226,232,240)]">
									{/* Empty top-left cell */}
								</th>
								{days.map((d) => (
									<th 
										key={d.date} 
										className={`py-3 px-1 border-r border-b border-slate-200 font-medium text-center min-w-[50px]
											${d.isSunday ? 'text-red-500' : d.isSaturday ? 'text-blue-500' : 'text-slate-500'}
										`}
									>
										{d.date}<br/><span className="text-[10px] font-normal">{d.dayName}</span>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td colSpan={days.length + 1} className="p-12 text-center text-slate-400 text-sm font-medium">휴가 기록을 불러오는 중입니다...</td></tr>
							) : employees.length === 0 ? (
								<tr><td colSpan={days.length + 1} className="p-12 text-center text-slate-400 text-sm font-medium">{year}년 {month}월 휴가 기록이 없습니다.</td></tr>
							) : (
								employees.map((emp) => (
									<tr 
										key={emp.id} 
										className={`border-b border-slate-200 group cursor-pointer transition-colors ${selectedEmployee?.id === emp.id ? 'bg-indigo-50/50' : ''}`}
										onClick={() => setSelectedEmployee(emp)}
									>
										<td className={`sticky left-0 z-20 p-3 border-r border-slate-200 shadow-[1px_0_0_rgb(226,232,240)] align-middle transition-colors ${selectedEmployee?.id === emp.id ? 'bg-indigo-50/50' : 'bg-white group-hover:bg-slate-50'}`}>
											<div className="font-bold text-slate-800 text-[13px]">{emp.name}</div>
										</td>
										{days.map((d) => {
											const leave = emp.requests.find(r => r.startDate <= d.fullDate && r.endDate >= d.fullDate);
											const isStart = leave && leave.startDate === d.fullDate;
											const isEnd = leave && leave.endDate === d.fullDate;
											const isSingleDay = leave && leave.startDate === leave.endDate;

											return (
												<td key={d.date} className={`p-0 border-r border-slate-100 align-middle transition-colors h-[50px] relative`}>
													{leave && (
														<div className={`absolute top-1/2 -translate-y-1/2 h-8 flex items-center justify-center font-bold text-[11px] px-1 z-10 overflow-hidden whitespace-nowrap
															${getLeaveColor(leave.leaveTypeName, leave.approvalStatus)}
															${isStart && !isSingleDay ? 'rounded-l-md left-1 right-0' : ''}
															${isEnd && !isSingleDay ? 'rounded-r-md left-0 right-1' : ''}
															${!isStart && !isEnd ? 'left-0 right-0' : ''}
															${isSingleDay ? 'rounded-md left-1 right-1' : ''}
														`} title={leave.reason || leave.leaveTypeName}>
															<span>
																{leave.leaveTypeName}{' '}
																{leave.approvalStatus === 'PENDING' && '(대기)'}
																{leave.approvalStatus === 'REJECTED' && '(반려)'}
															</span>
														</div>
													)}
												</td>
											);
										})}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Sidebar Detail Card */}
			{selectedEmployee ? (
				<div className="w-[380px] shrink-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-8 flex flex-col relative overflow-hidden animate-in slide-in-from-right-4 duration-300 h-full">
					<div className="text-sm font-bold text-indigo-900 mb-8 tracking-tight">휴가 관리 내역</div>
					
					{/* Avatar Profile */}
					<div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
						<div className="relative">
							<div className="absolute inset-0 bg-indigo-500 rounded-2xl blur opacity-30 animate-pulse"></div>
							<div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] to-indigo-500 text-white flex items-center justify-center text-xl font-black shadow-md shadow-indigo-200/50 border border-white/20">
								{selectedEmployee.name.slice(0, 1)}
							</div>
						</div>
						<div>
							<div className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
								{selectedEmployee.name}
							</div>
							<div className="text-slate-400 font-medium text-sm mt-0.5">휴가 신청 현황 상세</div>
						</div>
					</div>

					{/* Monthly Summary */}
					<div className="bg-gradient-to-br from-indigo-50/80 to-white rounded-2xl p-5 border border-indigo-100/50 shadow-sm relative overflow-hidden mb-6 shrink-0">
						<div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-100/40 rounded-full blur-xl pointer-events-none"></div>
						
						<div className="text-xs font-bold text-indigo-900/50 mb-4 uppercase tracking-wider flex items-center gap-2">
							<svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
							이번 달 휴가 요약
						</div>
						<div className="grid grid-cols-3 gap-2 relative z-10">
							<div className="flex flex-col gap-1">
								<div className="text-[10px] text-slate-500 font-bold">총 휴가일수</div>
								<div className="text-xl font-black text-indigo-700 tracking-tight">
									{selectedEmployee.requests.reduce((sum, r) => sum + r.days, 0)}<span className="text-xs font-bold text-indigo-400/80 ml-0.5">일</span>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<div className="text-[10px] text-slate-500 font-bold">승인완료</div>
								<div className="text-xl font-black text-slate-700 tracking-tight">
									{selectedEmployee.requests.filter(r => r.approvalStatus === 'APPROVED').length}<span className="text-xs font-bold text-slate-400/80 ml-0.5">건</span>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<div className="text-[10px] text-slate-500 font-bold">대기중</div>
								<div className="text-xl font-black text-amber-600 tracking-tight">
									{selectedEmployee.requests.filter(r => r.approvalStatus === 'PENDING').length}<span className="text-xs font-bold text-amber-400/80 ml-0.5">건</span>
								</div>
							</div>
						</div>
					</div>

					{/* List of leave requests */}
					<div className="flex-1 overflow-y-auto space-y-4 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
						{selectedEmployee.requests.map(req => (
							<div key={req.id} className="bg-white border border-slate-200/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-xl p-4 flex flex-col gap-3 hover:border-indigo-200/60 transition-colors">
								<div className="flex justify-between items-start">
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-2">
											<span className={`px-2 py-0.5 rounded text-[11px] font-bold ${req.approvalStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' : req.approvalStatus === 'APPROVED' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
												{req.leaveTypeName}
											</span>
											<span className="text-xs text-slate-400 font-mono">{req.documentNumber}</span>
										</div>
										<span className="text-sm font-bold text-slate-800 mt-1">{req.startDate} ~ {req.endDate} <span className="text-slate-500 font-medium text-xs ml-1">({req.days}일)</span></span>
									</div>
									<StatusBadge status={req.approvalStatus} />
								</div>
								
								{req.reason && (
									<div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-100 line-clamp-2">
										사유: {req.reason}
									</div>
								)}

								{req.approvalStatus !== "PENDING" && req.approverName && (
									<div className="text-[11px] text-slate-400 text-right mt-1">
										결재자: {req.approverName}
									</div>
								)}
							</div>
						))}
					</div>

					{/* Action Buttons Footer */}
					{selectedEmployee.requests.filter(r => r.approvalStatus === 'PENDING').length > 0 && (
						<div className="mt-auto pt-6 border-t border-slate-100 shrink-0">
							<div className="flex gap-2">
								<button
									onClick={() => selectedEmployee.requests.filter(r => r.approvalStatus === 'PENDING').forEach(req => decide(req.id, "approve"))}
									className="flex-1 rounded-xl bg-[#1e3a8a] px-4 py-3.5 text-[13px] font-bold text-white hover:bg-indigo-800 transition-colors shadow-md shadow-indigo-200/50"
								>
									{selectedEmployee.requests.filter(r => r.approvalStatus === 'PENDING').length > 1 ? '일괄 승인 처리' : '승인 처리'}
								</button>
								<button
									onClick={() => selectedEmployee.requests.filter(r => r.approvalStatus === 'PENDING').forEach(req => decide(req.id, "reject"))}
									className="flex-1 rounded-xl border border-[#ef4444] bg-white px-4 py-3.5 text-[13px] font-bold text-[#ef4444] hover:bg-red-50 transition-colors shadow-sm"
								>
									{selectedEmployee.requests.filter(r => r.approvalStatus === 'PENDING').length > 1 ? '일괄 반려' : '반려'}
								</button>
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="w-[380px] shrink-0 bg-slate-50/50 rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-full">
					<div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-5 border border-slate-100">
						<svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
					</div>
					<h3 className="text-base font-bold text-slate-700 mb-2">휴가 관리 상세 내역</h3>
					<p className="text-sm text-slate-500 font-medium">좌측 표에서 직원을 선택하시면<br/>해당 직원의 휴가 내역을 확인할 수 있습니다.</p>
				</div>
			)}
			{/* Apply Leave Modal */}
			{isApplyModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
						<div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
							<h2 className="text-lg font-bold text-slate-900 tracking-tight">휴가 신청하기</h2>
							<button onClick={() => setIsApplyModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
							</button>
						</div>
						<div className="p-6 space-y-4">
							<div className="space-y-1.5">
								<label className="text-sm font-bold text-slate-700">신청 직원</label>
								<select 
									value={applyForm.employeeId} 
									onChange={(e) => setApplyForm({...applyForm, employeeId: e.target.value})}
									className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
								>
									<option value="">직원을 선택하세요</option>
									{employeeList.map(emp => (
										<option key={emp.id} value={emp.id}>{emp.name}</option>
									))}
								</select>
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-bold text-slate-700">휴가 종류</label>
								<select 
									value={applyForm.leaveTypeId} 
									onChange={(e) => setApplyForm({...applyForm, leaveTypeId: e.target.value})}
									className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
								>
									<option value="">종류를 선택하세요</option>
									{leaveTypes.map(lt => (
										<option key={lt.id} value={lt.id}>{lt.name}</option>
									))}
								</select>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700">시작일</label>
									<input 
										type="date" 
										value={applyForm.startDate} 
										onChange={(e) => setApplyForm({...applyForm, startDate: e.target.value})}
										className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
									/>
								</div>
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700">종료일</label>
									<input 
										type="date" 
										value={applyForm.endDate} 
										onChange={(e) => setApplyForm({...applyForm, endDate: e.target.value})}
										className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
									/>
								</div>
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-bold text-slate-700">신청 일수</label>
								<input 
									type="number" 
									value={applyForm.days} 
									onChange={(e) => setApplyForm({...applyForm, days: e.target.value})}
									className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
									min="0.5" step="0.5"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-bold text-slate-700">사유</label>
								<textarea 
									rows={2} 
									value={applyForm.reason} 
									onChange={(e) => setApplyForm({...applyForm, reason: e.target.value})}
									placeholder="휴가 사유를 자세히 입력하세요" 
									className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors"
								></textarea>
							</div>
						</div>
						<div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
							<Button variant="outline" onClick={() => setIsApplyModalOpen(false)} className="text-slate-600 hover:bg-slate-200 font-semibold px-5 rounded-lg h-10 border-slate-300">
								취소
							</Button>
							<Button variant="primary" onClick={handleApplySubmit} className="font-bold px-6 rounded-lg h-10 shadow-sm">
								신청하기
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

