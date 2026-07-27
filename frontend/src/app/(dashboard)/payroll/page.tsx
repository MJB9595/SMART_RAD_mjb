"use client";

import { useEffect, useState } from "react";
import { listPayrolls } from "@/lib/api/payroll";
import type { Payroll } from "@/lib/types/payroll";
import { Button } from "@/components/ui";

export default function PayrollPage() {
	const [payrolls, setPayrolls] = useState<Payroll[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [loading, setLoading] = useState(true);
	const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

	function load() {
		setLoading(true);
		listPayrolls()
			.then((page) => {
				setPayrolls(page.content);
				setTotalElements(page.totalElements);
				if (page.content.length > 0) {
					setSelectedPayroll(page.content[0]);
				}
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load();
	}, []);

	const getStatusPill = (status?: string) => {
		if (status === "COMPLETED") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">정산완료</span>;
		if (status === "PENDING") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">정산대기</span>;
		if (status === "ERROR") return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">오류</span>;
		return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status || "대기"}</span>;
	};

	const formatCurrency = (val?: number) => {
		if (val == null) return "0";
		return val.toLocaleString("ko-KR");
	};

	return (
		<div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
			{/* Header Section */}
			<div className="flex justify-between items-end bg-gradient-to-r from-indigo-50 to-white p-6 rounded-2xl shadow-sm border border-indigo-100/50">
				<div>
					<nav className="mb-2 text-xs font-semibold text-indigo-500 tracking-wider uppercase">
						Salary Management <span className="mx-2 text-indigo-300">/</span> Overview
					</nav>
					<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">급여 명세서 조회</h1>
					<p className="mt-2 text-sm text-slate-600 font-medium">근태와 연동된 기초 급여 내역을 조회하고 상세 내역을 확인합니다.</p>
				</div>
				<Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all">엑셀 다운로드</Button>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
					<div className="text-sm font-semibold text-slate-500">이번 달 대상</div>
					<div className="mt-3 flex items-baseline gap-1"><span className="text-3xl font-bold text-slate-900">{totalElements}</span><span className="text-slate-500 font-medium">명</span></div>
				</div>
				<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
					<div className="text-sm font-semibold text-slate-500">정산 완료</div>
					<div className="mt-3 flex items-baseline gap-1"><span className="text-3xl font-bold text-emerald-600">{payrolls.filter(p => p.payrollStatusCode === "COMPLETED").length}</span><span className="text-slate-500 font-medium">건</span></div>
				</div>
				<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
					<div className="flex justify-between items-center"><span className="text-sm font-semibold text-slate-500">정산 대기</span><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span></div>
					<div className="mt-3 flex items-baseline gap-1"><span className="text-3xl font-bold text-amber-500">{payrolls.filter(p => p.payrollStatusCode !== "COMPLETED" && p.payrollStatusCode !== "ERROR").length}</span><span className="text-slate-500 font-medium">건</span></div>
				</div>
				<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
					<div className="text-sm font-semibold text-slate-500">정산 오류</div>
					<div className="mt-3 flex items-baseline gap-1"><span className="text-3xl font-bold text-rose-500">{payrolls.filter(p => p.payrollStatusCode === "ERROR").length}</span><span className="text-slate-500 font-medium">건</span></div>
				</div>
			</div>

			<div className="flex flex-col lg:flex-row gap-6">
				{/* Table Area */}
				<div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
					<div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
						<h2 className="text-lg font-bold text-slate-900">급여 대장 목록</h2>
						<div className="flex gap-2">
							<button className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">필터</button>
						</div>
					</div>
					<div className="flex-1 overflow-auto">
						<table className="w-full text-left text-sm whitespace-nowrap">
							<thead className="sticky top-0 bg-slate-50 text-slate-500 z-10 shadow-[0_1px_0_rgb(241,245,249)]">
								<tr>
									<th className="px-6 py-4 font-semibold">대상자</th>
									<th className="px-6 py-4 font-semibold text-right">총지급액</th>
									<th className="px-6 py-4 font-semibold text-right">총공제액</th>
									<th className="px-6 py-4 font-semibold text-right">실지급액</th>
									<th className="px-6 py-4 font-semibold text-center">상태</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{payrolls.map((p) => (
									<tr 
										key={p.id} 
										onClick={() => setSelectedPayroll(p)} 
										className={`cursor-pointer transition-colors ${selectedPayroll?.id === p.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-inner">
													{p.employeeName?.slice(0, 1) || "-"}
												</div>
												<div>
													<div className="font-bold text-slate-900">{p.employeeName}</div>
													<div className="text-xs text-slate-500 font-medium">{p.departmentName}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 text-right font-medium text-slate-600">{formatCurrency(p.totalPayAmount)}</td>
										<td className="px-6 py-4 text-right font-medium text-rose-500">-{formatCurrency(p.totalDeductionAmount)}</td>
										<td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(p.realPayAmount)}</td>
										<td className="px-6 py-4 text-center">{getStatusPill(p.payrollStatusCode)}</td>
									</tr>
								))}
								{payrolls.length === 0 && !loading && (
									<tr>
										<td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">내역이 없습니다.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-xs font-medium text-slate-500 flex justify-between items-center">
						<span>전체 {totalElements}건 중 1–{payrolls.length}건 표시</span>
					</div>
				</div>

				{/* Detail View Sidebar */}
				{selectedPayroll && (
					<div className="w-full lg:w-[380px] shrink-0 bg-white rounded-2xl shadow-xl shadow-indigo-100/20 border border-indigo-100 overflow-hidden flex flex-col h-[600px] relative">
						<div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-600 absolute top-0 left-0 w-full z-0"></div>
						<div className="relative z-10 px-6 pt-12 pb-6 flex flex-col items-center">
							<div className="w-20 h-20 rounded-full bg-white shadow-lg p-1 mb-4">
								<div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-700">
									{selectedPayroll.employeeName?.slice(0, 1) || "-"}
								</div>
							</div>
							<div className="text-xl font-bold text-slate-900">{selectedPayroll.employeeName}</div>
							<div className="text-sm font-medium text-slate-500 mt-1">{selectedPayroll.departmentName} · {selectedPayroll.positionName}</div>
							<div className="mt-3 text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{selectedPayroll.payrollYearMonth} 정산내역</div>
						</div>

						<div className="flex-1 overflow-auto px-6 pb-6 space-y-6">
							<div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-slate-500">총 지급액</span>
									<span className="text-sm font-bold text-slate-900">{formatCurrency(selectedPayroll.totalPayAmount)}원</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-slate-500">총 공제액</span>
									<span className="text-sm font-bold text-rose-500">-{formatCurrency(selectedPayroll.totalDeductionAmount)}원</span>
								</div>
								<div className="h-px bg-slate-200 w-full my-2"></div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-bold text-slate-700">실지급액</span>
									<span className="text-lg font-extrabold text-indigo-600">{formatCurrency(selectedPayroll.realPayAmount)}원</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="border border-slate-100 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
									<div className="text-xs font-semibold text-slate-400 mb-1">지급 상태</div>
									<div className="text-sm font-bold text-slate-800">{selectedPayroll.payrollStatusCode === 'COMPLETED' ? '지급 완료' : '정산 대기'}</div>
								</div>
								<div className="border border-slate-100 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
									<div className="text-xs font-semibold text-slate-400 mb-1">전월 대비</div>
									<div className="text-sm font-bold text-slate-800">-</div>
								</div>
							</div>
							
							<div className="pt-4">
								<Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-colors">
									상세 엑셀 다운로드
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
