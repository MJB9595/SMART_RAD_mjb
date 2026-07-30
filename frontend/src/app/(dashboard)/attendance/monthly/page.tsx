"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui";
import {
	exportMonthlyAttendance,
	listMonthlyAttendance,
	type MonthlyAttendance,
} from "@/lib/api/attendance";
import { useAuth } from "@/lib/auth/AuthContext";

// 격자 한 칸의 화면 표현
interface DailyData {
	in?: string;
	out?: string;
	status?: "연차" | "반차" | "X" | "normal";
	isLate?: boolean;
}

export default function MonthlyAttendancePage() {
	const { user } = useAuth();
	const [year, setYear] = useState("2026");
	const [month, setMonth] = useState("07");
	const [rows, setRows] = useState<MonthlyAttendance[]>([]);
	const [loading, setLoading] = useState(true);
	const [showLateOnly, setShowLateOnly] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<MonthlyAttendance | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [downloading, setDownloading] = useState(false);

	function handleExport() {
		setDownloading(true);
		exportMonthlyAttendance(Number(year), Number(month))
			.catch((error) => {
				alert(error instanceof Error ? error.message : "엑셀 다운로드에 실패했습니다.");
			})
			.finally(() => setDownloading(false));
	}

	useEffect(() => {
		let active = true;
		setLoading(true);
		listMonthlyAttendance(Number(year), Number(month))
			.then((data) => {
				if (active) {
					setRows(data);
					if (data.length > 0 && !selectedEmployee) {
						setSelectedEmployee(data[0]);
					}
				}
			})
			.catch(() => {
				if (active) setRows([]);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [year, month]);

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
			});
		}
		return result;
	}, [year, month, daysInMonth]);

	/**
	 * 서버가 준 실제 근태를 격자 표현으로 변환한다.
	 * 이전에는 여기서 Math.random() 으로 값을 만들어 냈기 때문에, 화면에 보이던 출퇴근 시각은
	 * 실제 기록과 무관했고 새로고침할 때마다 바뀌었다.
	 */
	const dailyByEmployee = useMemo(() => {
		const toCell = (d: { status: string; checkInTime: string | null; checkOutTime: string | null }): DailyData => {
			const hhmm = (t: string | null) => (t ? t.slice(0, 5) : undefined);
			switch (d.status) {
				case "ANNUAL_LEAVE":
					return { status: "연차" };
				case "ABSENT":
					return { status: "X" };
				case "LATE":
					return { in: hhmm(d.checkInTime), out: hhmm(d.checkOutTime), status: "normal", isLate: true };
				default:
					return { in: hhmm(d.checkInTime), out: hhmm(d.checkOutTime), status: "normal" };
			}
		};
		const map: Record<number, Record<number, DailyData>> = {};
		rows.forEach((emp) => {
			map[emp.employeeId] = {};
			Object.entries(emp.daily ?? {}).forEach(([day, detail]) => {
				map[emp.employeeId][Number(day)] = toCell(detail);
			});
		});
		return map;
	}, [rows]);

	const getDeptColor = (dept: string) => {
		if (dept.includes("해외영업")) return "bg-teal-500 text-white";
		if (dept.includes("마케팅")) return "bg-lime-200 text-lime-900";
		if (dept.includes("운영")) return "bg-indigo-200 text-indigo-900";
		if (dept.includes("영업")) return "bg-slate-200 text-slate-900";
		if (dept.includes("인사") || dept.includes("총무")) return "bg-rose-400 text-white";
		return "bg-slate-200 text-slate-800";
	};

	return (
		<div className="flex flex-1 w-full gap-6 pb-4 min-h-0">
			{/* Main Grid View */}
			<div className="flex-1 flex flex-col bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm">
				{/* Header */}
				<div className="flex flex-wrap justify-between items-center p-5 border-b border-slate-200 bg-white gap-4">
					<div className="flex items-center gap-4 sm:gap-8 flex-wrap">
						<h1 className="text-[22px] font-bold text-slate-900 tracking-tight">출퇴근기록 관리</h1>
					</div>
					<Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 font-medium h-9 px-5" onClick={handleExport} disabled={downloading}>
						{downloading ? "다운로드 중" : "다운로드"}
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
							<option>활성 직원</option>
							<option>전체 직원</option>
						</select>
						<div className="flex items-center bg-slate-50 border border-slate-300 rounded h-[34px] px-3 text-sm text-slate-700">
							<span className="text-slate-500 mr-3">지각 표시 범위</span>
							<select className="bg-transparent outline-none font-medium">
								<option>0분</option>
								<option>10분</option>
							</select>
						</div>
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
										className={`py-3 px-1 border-r border-b border-slate-200 font-medium text-center min-w-[120px]
											${d.isSunday ? 'text-red-500' : d.isSaturday ? 'text-blue-500' : 'text-slate-500'}
										`}
									>
										{d.date}/{d.dayName}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td colSpan={days.length + 1} className="p-12 text-center text-slate-400 text-sm font-medium">근태 기록을 불러오는 중입니다...</td></tr>
							) : rows.length === 0 ? (
								<tr><td colSpan={days.length + 1} className="p-12 text-center text-slate-400 text-sm font-medium">{year}년 {month}월 근태 기록이 없습니다.</td></tr>
							) : (
								rows.map((emp) => {
									// 전체를 보는 인사팀·관리자 화면에서 본인 행을 찾기 쉽도록 강조한다
									const isMine = emp.employeeId === user?.employeeId;
									const rowBg = selectedEmployee?.employeeId === emp.employeeId
										? 'bg-indigo-50/50'
										: isMine ? 'bg-amber-50/60' : '';
									return (
									<tr 
										key={emp.employeeId} 
										className={`border-b border-slate-200 group cursor-pointer transition-colors ${rowBg}`}
										onClick={() => setSelectedEmployee(emp)}
									>
										<td className={`sticky left-0 z-20 p-3 border-r border-slate-200 shadow-[1px_0_0_rgb(226,232,240)] align-top transition-colors ${rowBg || 'bg-white group-hover:bg-slate-50'}`}>
											<div className="text-[11px] text-slate-400 font-medium mb-[2px]">{emp.employeeNumber}</div>
											<div className="font-bold text-slate-800 text-[13px]">
												{emp.employeeName}
												{isMine && <span className="ml-1.5 text-[10px] font-bold text-amber-700">본인</span>}
											</div>
										</td>
										{days.map((d) => {
											const dayData = dailyByEmployee[emp.employeeId]?.[d.date];
											const cellBg = dayData?.status === '연차' || dayData?.status === 'X' ? 'bg-slate-50/70' : 'bg-transparent';
											
											return (
												<td key={d.date} className={`p-0 border-r border-slate-100 align-top ${cellBg} group-hover:bg-slate-50/50 transition-colors`}>
													{!dayData ? (
														<div className="h-[90px] w-full"></div>
													) : (
														<div className="flex flex-col h-[90px] w-full relative">
															<div className="flex flex-col items-center flex-1 justify-center gap-[1px] pt-1 pb-[22px]">
																{dayData.status === '연차' ? (
																	<span className="text-slate-500 font-medium text-xs">연차</span>
																) : dayData.status === 'X' ? (
																	<span className="text-slate-300 font-bold text-sm">X</span>
																) : (
																	<>
																		{dayData.in && (
																			<span className={`font-semibold text-xs tracking-tight ${dayData.isLate ? 'text-red-600' : 'text-slate-700'}`}>
																				{dayData.in}
																			</span>
																		)}
																		{dayData.status === '반차' && <span className="text-slate-500 font-medium text-[11px]">반차</span>}
																		{dayData.out && (
																			<span className="text-slate-700 font-semibold text-xs tracking-tight">
																				{dayData.out}
																			</span>
																		)}
																	</>
																)}
															</div>
															{(dayData.in || dayData.status === '연차' || dayData.status === '반차') && (
																<div className={`w-full text-center text-[11px] py-[3px] truncate px-1 font-bold tracking-tight absolute bottom-0 ${getDeptColor(emp.departmentName)}`} title={emp.departmentName}>
																	{emp.departmentName}
																</div>
															)}
														</div>
													)}
												</td>
											);
										})}
									</tr>
								);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Sidebar Detail Card */}
			{selectedEmployee && (
				<div className="w-[380px] shrink-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-8 flex flex-col relative overflow-hidden animate-in slide-in-from-right-4 duration-300 h-full">
					<div className="text-sm font-bold text-indigo-900 mb-8 tracking-tight">인사기록카드 미리보기</div>
					
					{/* Avatar Profile */}
					<div className="flex flex-col items-start mb-8">
						<div className="w-16 h-16 rounded-2xl bg-[#1e3a8a] text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-200 mb-4">
							{selectedEmployee.employeeName?.slice(0, 1) || '관'}
						</div>
						<div className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedEmployee.employeeName}</div>
						<div className="flex items-center gap-2 mt-1">
							<span className="text-slate-400 font-medium text-sm">{selectedEmployee.departmentName} · 사원</span>
							<span className="text-[#1e3a8a] font-bold text-sm">직원</span>
						</div>
					</div>

					{/* Simple Info List */}
					<div className="space-y-4 mb-8">
						<div className="flex justify-between items-center py-2 border-b border-slate-100">
							<span className="text-slate-400 font-medium text-sm">사번</span>
							<span className="text-slate-900 font-bold text-sm font-mono tracking-tight">{selectedEmployee.employeeNumber}</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-slate-100">
							<span className="text-slate-400 font-medium text-sm">임용일</span>
							<span className="text-slate-900 font-bold text-sm font-mono tracking-tight">2020-01-01</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-slate-100">
							<span className="text-slate-400 font-medium text-sm">최종학력</span>
							<span className="text-slate-900 font-bold text-sm tracking-tight">-</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-slate-100">
							<span className="text-slate-400 font-medium text-sm">대표자격</span>
							<span className="text-slate-900 font-bold text-sm tracking-tight">-</span>
						</div>
					</div>

					{/* Minimized 3-Block Stats (Replaced with Attendance as requested previously) */}
					<div className="grid grid-cols-3 gap-2 mb-10">
						<div className="bg-[#f8f9fa] rounded-xl p-3 flex flex-col items-center justify-center transition-colors hover:bg-slate-100">
							<div className="text-[12px] font-medium text-slate-400 mb-1">출근</div>
							<div className="text-lg font-bold text-slate-900">{selectedEmployee.present}일</div>
						</div>
						<div className="bg-[#f8f9fa] rounded-xl p-3 flex flex-col items-center justify-center transition-colors hover:bg-slate-100">
							<div className="text-[12px] font-medium text-slate-400 mb-1">지각</div>
							<div className="text-lg font-bold text-slate-900">{selectedEmployee.late}회</div>
						</div>
						<div className="bg-[#f8f9fa] rounded-xl p-3 flex flex-col items-center justify-center transition-colors hover:bg-slate-100">
							<div className="text-[12px] font-medium text-slate-400 mb-1">결근</div>
							<div className="text-lg font-bold text-slate-900">{selectedEmployee.absent}일</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="mt-auto space-y-3">
						<Button 
							variant="outline" 
							className="w-full justify-center border-[#1e3a8a] text-[#1e3a8a] hover:bg-indigo-50 font-bold py-6 rounded-xl"
							onClick={() => setIsDetailModalOpen(true)}
						>
							전체 기록 상세보기
						</Button>
					</div>
				</div>
			)}

			{/* Detail Modal */}
			{isDetailModalOpen && selectedEmployee && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
						<div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
							<div>
								<h2 className="text-xl font-bold text-slate-900 tracking-tight">{selectedEmployee.employeeName} 상세 근태 기록</h2>
								<p className="text-sm text-slate-500 mt-1">{year}년 {month}월</p>
							</div>
							<button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
								<svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
							</button>
						</div>
						<div className="p-0 overflow-y-auto bg-white">
							<table className="w-full text-sm text-left">
								<thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 sticky top-0 z-10">
									<tr>
										<th className="py-3 px-6">날짜</th>
										<th className="py-3 px-6">출근</th>
										<th className="py-3 px-6">퇴근</th>
										<th className="py-3 px-6">상태</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{days.map((d) => {
										const dayData = dailyByEmployee[selectedEmployee.employeeId]?.[d.date];
										return (
											<tr key={d.date} className="hover:bg-slate-50 transition-colors">
												<td className={`py-4 px-6 font-medium ${d.isSunday ? 'text-red-500' : d.isSaturday ? 'text-blue-500' : 'text-slate-700'}`}>
													{d.date}일 ({d.dayName})
												</td>
												<td className={`py-4 px-6 font-semibold ${dayData?.isLate ? 'text-red-600' : 'text-slate-600'}`}>{dayData?.in || '-'}</td>
												<td className="py-4 px-6 text-slate-600 font-semibold">{dayData?.out || '-'}</td>
												<td className="py-4 px-6">
													{!dayData ? (
														<span className="text-slate-400">-</span>
													) : dayData.isLate ? (
														<span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-md text-[11px] font-extrabold">지각</span>
													) : dayData.status === 'normal' ? (
														<span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-[11px] font-extrabold">정상</span>
													) : (
														<span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md text-[11px] font-extrabold">{dayData.status}</span>
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
