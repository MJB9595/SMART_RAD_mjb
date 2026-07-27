"use client";

import { useEffect, useMemo, useState } from "react";
import { getDashboardHeadcount, type HeadcountDto } from "@/lib/api/dashboard";
import { listDepartments } from "@/lib/api/departments";
import { searchEmployees } from "@/lib/api/employees";
import type { Department } from "@/lib/types/department";
import type { Employee } from "@/lib/types/employee";

export default function HeadcountPage() {
	const [headcounts, setHeadcounts] = useState<HeadcountDto[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	// Modal state
	const [selectedDept, setSelectedDept] = useState<Department | null>(null);
	const [deptEmployees, setDeptEmployees] = useState<Employee[]>([]);
	const [loadingModal, setLoadingModal] = useState(false);

	useEffect(() => {
		setLoading(true);
		Promise.all([getDashboardHeadcount(), listDepartments()])
			.then(([stats, depts]) => {
				setHeadcounts(stats);
				setDepartments(depts);
			})
			.catch((err) => {
				console.error("Dashboard API Error:", err);
				setError(err?.message || "대시보드를 불러오지 못했습니다.");
			})
			.finally(() => setLoading(false));
	}, []);

	// Fetch employees when a department is clicked
	useEffect(() => {
		if (selectedDept) {
			setLoadingModal(true);
			setDeptEmployees([]);
			searchEmployees({ departmentId: String(selectedDept.id), size: 100 })
				.then((res) => {
					setDeptEmployees(res.content);
				})
				.catch(console.error)
				.finally(() => setLoadingModal(false));
		}
	}, [selectedDept]);

	const headcountByDeptName = useMemo(() => {
		const map = new Map<string, number>();
		for (const h of headcounts) map.set(h.departmentName, h.headcount);
		return map;
	}, [headcounts]);

	const leafDepartments = useMemo(() => departments.filter((d) => d.headcount > 0), [departments]);

	const totals = useMemo(() => {
		let totalQuota = 0;
		let totalActual = 0;
		leafDepartments.forEach(d => {
			totalQuota += d.headcount;
			totalActual += headcountByDeptName.get(d.name) ?? 0;
		});
		const overallRate = totalQuota > 0 ? Math.round((totalActual / totalQuota) * 100) : 0;
		
		return { totalQuota, totalActual, overallRate };
	}, [leafDepartments, headcountByDeptName]);

	if (loading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="text-slate-400 font-medium">대시보드를 불러오는 중입니다...</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8 pb-10">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<nav className="text-sm font-medium text-slate-500 mb-1 tracking-tight">
					통계 대시보드 <span className="mx-1 text-slate-300">/</span>{" "}
					<span className="text-indigo-600">부서별 정원 현황</span>
				</nav>
				<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">부서별 정원 현황</h1>
				<p className="text-slate-500 text-sm mt-1">각 부서의 정원 대비 현재 근무 인원(충원율)을 실시간으로 확인합니다.</p>
			</div>

			{error && (
				<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 font-medium shadow-sm">
					{error}
				</div>
			)}

			{/* Summary Widgets */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Widget 1 */}
				<div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
					<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
					<div className="text-slate-500 font-semibold text-sm mb-2 flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
						</div>
						조직 전체 정원
					</div>
					<div className="flex items-baseline gap-1 mt-2">
						<span className="text-4xl font-extrabold text-slate-900 tracking-tight">{totals.totalQuota}</span>
						<span className="text-slate-400 font-medium text-sm">명</span>
					</div>
				</div>

				{/* Widget 2 */}
				<div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
					<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
					<div className="text-slate-500 font-semibold text-sm mb-2 flex items-center gap-2">
						<div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
						</div>
						조직 전체 현원
					</div>
					<div className="flex items-baseline gap-1 mt-2">
						<span className="text-4xl font-extrabold text-slate-900 tracking-tight">{totals.totalActual}</span>
						<span className="text-slate-400 font-medium text-sm">명</span>
					</div>
				</div>

				{/* Widget 3 */}
				<div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
					<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
					<div className="flex justify-between items-start mb-2">
						<div className="text-slate-500 font-semibold text-sm flex items-center gap-2">
							<div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
							</div>
							조직 전체 충원율
						</div>
						{/* Small decorative ring */}
						<div className="w-10 h-10 relative flex items-center justify-center">
							<svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
								<circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4"></circle>
								<circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-500" strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - totals.overallRate} strokeLinecap="round"></circle>
							</svg>
						</div>
					</div>
					<div className="flex items-baseline gap-1 mt-1">
						<span className="text-4xl font-extrabold text-indigo-600 tracking-tight">{totals.overallRate}</span>
						<span className="text-indigo-400 font-medium text-lg">%</span>
					</div>
				</div>
			</div>

			{/* Grid Cards */}
			<div>
				<h2 className="text-lg font-bold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
					상세 부서 현황
					<span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-bold">{leafDepartments.length}</span>
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
					{leafDepartments.map((d) => {
						const actual = headcountByDeptName.get(d.name) ?? 0;
						const rate = d.headcount > 0 ? Math.round((actual / d.headcount) * 100) : 0;
						
						// Use unified Indigo theme for all cards to match the site's design
						let bgProgress = "bg-indigo-500";
						let textDark = "text-indigo-700";
						let textLight = "text-indigo-500";

						return (
							<div 
								key={d.id} 
								onClick={() => setSelectedDept(d)}
								className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:-translate-y-1 duration-300 relative overflow-hidden flex flex-col"
							>
								{/* Subtle top border accent */}
								<div className={`absolute top-0 left-0 right-0 h-1 ${bgProgress} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
								
								<div className="flex justify-between items-start mb-6">
									<h3 className="font-bold text-slate-800 text-base leading-tight w-[70%] line-clamp-2 group-hover:text-indigo-600 transition-colors">{d.name}</h3>
									<div className={`text-2xl font-extrabold tracking-tight ${textDark}`}>
										{rate}<span className={`text-sm ml-0.5 ${textLight}`}>%</span>
									</div>
								</div>

								<div className="mt-auto">
									<div className="flex justify-between items-end mb-2">
										<div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Headcount</div>
										<div className="text-sm font-semibold text-slate-700">
											<span className={actual < d.headcount ? "text-slate-900 font-bold" : ""}>{actual}</span>
											<span className="text-slate-400 mx-1">/</span>
											<span className="text-slate-400">{d.headcount}명</span>
										</div>
									</div>

									{/* Progress Bar Container */}
									<div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
										{/* Animated Progress Bar */}
										<div 
											className={`h-full rounded-full ${bgProgress} transition-all duration-1000 ease-out`} 
											style={{ width: `${Math.min(rate, 100)}%` }}
										></div>
									</div>
									
									{rate > 100 && (
										<div className="mt-2 text-[11px] font-bold text-indigo-600 flex items-center gap-1">
											<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
											정원 초과
										</div>
									)}
									{rate < 50 && (
										<div className="mt-2 text-[11px] font-bold text-slate-500 flex items-center gap-1">
											<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
											충원 시급
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Department Detail Modal */}
			{selectedDept && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
						<div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
							<div>
								<h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
									{selectedDept.name} 상세 현황
								</h2>
								<p className="text-sm text-slate-500 mt-1 font-medium">정원 {selectedDept.headcount}명 중 현재 {headcountByDeptName.get(selectedDept.name) ?? 0}명 재직</p>
							</div>
							<button onClick={() => setSelectedDept(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
							</button>
						</div>
						<div className="p-0 overflow-y-auto bg-slate-50/50 flex-1">
							{loadingModal ? (
								<div className="p-12 text-center text-slate-400 font-medium flex flex-col items-center gap-3">
									<svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
									부서 인원 정보를 불러오는 중입니다...
								</div>
							) : deptEmployees.length === 0 ? (
								<div className="p-12 text-center text-slate-400 font-medium">
									해당 부서에 소속된 교직원이 없습니다.
								</div>
							) : (
								<ul className="divide-y divide-slate-100 bg-white border-y border-slate-100">
									{deptEmployees.map((emp) => (
										<li key={emp.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center group">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
													{emp.name.slice(0, 1)}
												</div>
												<div>
													<div className="font-bold text-slate-800 text-sm">{emp.name}</div>
													<div className="text-xs text-slate-500 mt-0.5">{emp.positionName} · {emp.email}</div>
												</div>
											</div>
											<span className={`text-[11px] font-extrabold px-2 py-1 rounded-md ${
												emp.employmentStatus === 'EMPLOYED' ? 'bg-green-100 text-green-700' : 
												emp.employmentStatus === 'ON_LEAVE' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
											}`}>
												{emp.employmentStatus === 'EMPLOYED' ? '재직' : emp.employmentStatus === 'ON_LEAVE' ? '휴직' : '퇴직'}
											</span>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
