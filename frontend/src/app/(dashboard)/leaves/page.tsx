"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui";
import { listLeaveRequests, approveLeave, rejectLeave } from "@/lib/api/leaves";
import { ApiError } from "@/lib/api/client";
import { StatusBadge } from "@/components/StatusBadge";
import type { LeaveRequest, LeaveType } from "@/lib/types/leave";

const TYPE_LABELS: Record<LeaveType, string> = {
	ANNUAL: "연차",
	SICK: "병가",
	OFFICIAL: "공가",
	SPECIAL: "특별휴가",
	PARENTAL: "육아휴직",
};

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

	const getLeaveColor = (type: LeaveType, status: string) => {
		if (status === 'REJECTED') return 'bg-slate-100 text-slate-400 line-through';
		if (status === 'PENDING') return 'bg-amber-100 text-amber-700 border border-amber-300';
		
		switch (type) {
			case 'ANNUAL': return 'bg-rose-100 text-rose-700';
			case 'SICK': return 'bg-blue-100 text-blue-700';
			case 'OFFICIAL': return 'bg-emerald-100 text-emerald-700';
			case 'SPECIAL': return 'bg-purple-100 text-purple-700';
			case 'PARENTAL': return 'bg-indigo-100 text-indigo-700';
			default: return 'bg-slate-100 text-slate-700';
		}
	};

	return (
		<div className="flex w-full h-full gap-6 pb-4">
			{/* Main Grid View */}
			<div className="flex-1 flex flex-col bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm">
				{/* Header */}
				<div className="flex flex-wrap justify-between items-center p-5 border-b border-slate-200 bg-white gap-4">
					<div className="flex items-center gap-4 sm:gap-8 flex-wrap">
						<h1 className="text-[22px] font-bold text-slate-900 tracking-tight">월 휴가 관리 · 현황</h1>
					</div>
					<Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 font-medium h-9 px-5">
						다운로드
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
				<div className="flex-1 overflow-x-auto overflow-y-auto bg-slate-50/50 [&::-webkit-scrollbar]:h-[10px] [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
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
												<td key={d.date} className={`p-1 border-r border-slate-100 align-middle transition-colors h-[50px]`}>
													{leave && (
														<div className={`h-full w-full flex items-center justify-center font-bold text-[11px] px-1 
															${getLeaveColor(leave.leaveType, leave.approvalStatus)}
															${isStart && !isSingleDay ? 'rounded-l-md ml-1' : ''}
															${isEnd && !isSingleDay ? 'rounded-r-md mr-1' : ''}
															${!isStart && !isEnd ? '' : ''}
															${isSingleDay ? 'rounded-md mx-1' : ''}
														`} title={leave.reason || TYPE_LABELS[leave.leaveType]}>
															{isStart || d.dayName === '월' || d.date === 1 ? (
																<span className="truncate">{TYPE_LABELS[leave.leaveType]} {leave.approvalStatus === 'PENDING' && '(대기)'}</span>
															) : null}
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
			{selectedEmployee && (
				<div className="w-[380px] shrink-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-8 flex flex-col relative overflow-hidden animate-in slide-in-from-right-4 duration-300 h-full">
					<div className="text-sm font-bold text-indigo-900 mb-8 tracking-tight">휴가 관리 내역</div>
					
					{/* Avatar Profile */}
					<div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
						<div className="w-14 h-14 rounded-2xl bg-[#1e3a8a] text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-200">
							{selectedEmployee.name.slice(0, 1)}
						</div>
						<div>
							<div className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedEmployee.name}</div>
							<div className="text-slate-400 font-medium text-sm mt-0.5">휴가 신청 요약</div>
						</div>
					</div>

					{/* List of leave requests */}
					<div className="flex-1 overflow-y-auto space-y-4 pr-2">
						{selectedEmployee.requests.map(req => (
							<div key={req.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
								<div className="flex justify-between items-start">
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-2">
											<span className={`px-2 py-0.5 rounded text-[11px] font-bold ${req.approvalStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' : req.approvalStatus === 'APPROVED' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
												{TYPE_LABELS[req.leaveType]}
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

								{req.approvalStatus === "PENDING" && (
									<div className="flex gap-2 mt-1">
										<button
											onClick={() => decide(req.id, "approve")}
											className="flex-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
										>
											승인하기
										</button>
										<button
											onClick={() => decide(req.id, "reject")}
											className="flex-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
										>
											반려하기
										</button>
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
				</div>
			)}
		</div>
	);
}

