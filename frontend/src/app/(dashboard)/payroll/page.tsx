"use client";

import { useEffect, useState } from "react";
import { exportPayroll, exportPayrolls, getPayrollFilterOptions, listPayrolls, type PayrollFilterOptions } from "@/lib/api/payroll";
import type { Payroll } from "@/lib/types/payroll";
import { useFeedback } from "@/components/feedback/FeedbackProvider";

export default function PayrollPage() {
	const { notify, confirm: askConfirm } = useFeedback();
	const [payrolls, setPayrolls] = useState<Payroll[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [loading, setLoading] = useState(true);
	const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
	const [downloading, setDownloading] = useState<"all" | "one" | null>(null);
	// 필터 — 선택지는 실제 데이터에서 받아 온다(화면이 임의 목록을 만들지 않도록)
	const [yearMonth, setYearMonth] = useState("");
	const [status, setStatus] = useState("");
	const [keyword, setKeyword] = useState("");
	const [options, setOptions] = useState<PayrollFilterOptions>({ yearMonths: [], statuses: [] });

	function runExport(kind: "all" | "one", task: Promise<void>) {
		setDownloading(kind);
		task
			.catch((error) => {
				notify(error instanceof Error ? error.message : "엑셀 다운로드에 실패했습니다.", "error");
			})
			.finally(() => setDownloading(null));
	}

	function load() {
		setLoading(true);
		const params: Record<string, string> = {};
		if (yearMonth) params.yearMonth = yearMonth;
		if (status) params.status = status;
		if (keyword.trim()) params.keyword = keyword.trim();
		listPayrolls(params)
			.then((page) => {
				setPayrolls(page.content);
				setTotalElements(page.totalElements);
				// 필터 결과에 없는 대상이 상세에 남아 있으면 목록과 어긋나므로 맞춰 준다
				setSelectedPayroll(page.content.length > 0 ? page.content[0] : null);
			})
			.catch(() => notify("급여 대장을 불러오지 못했습니다.", "error"))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load();
	}, [yearMonth, status]);

	useEffect(() => {
		getPayrollFilterOptions().then(setOptions).catch(() => setOptions({ yearMonths: [], statuses: [] }));
	}, []);


	/** 급여 상태 코드는 백엔드 기준 DRAFT/CONFIRMED/PAID 다. 화면이 쓰던 COMPLETED/PENDING/ERROR 는 존재하지 않는 값이라 늘 빗나갔다. */
	const statusLabel = (code?: string) =>
		code === "DRAFT" ? "작성중" : code === "CONFIRMED" ? "확정" : code === "PAID" ? "지급완료" : (code ?? "-");

	const getStatusPill = (status?: string) => {
		if (status === "PAID") return <span className="pill green">지급완료</span>;
		if (status === "CONFIRMED") return <span className="pill blue">확정</span>;
		if (status === "DRAFT") return <span className="pill amber">작성중</span>;
		return <span className="pill gray">{status || "대기"}</span>;
	};

	const formatCurrency = (val?: number) => {
		if (val == null) return "0";
		return val.toLocaleString("ko-KR");
	};

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">급여 명세서 조회</div>
					<div className="page-sub">근태와 연동된 기초 급여 내역을 조회하고 상세 내역을 확인합니다</div>
				</div>
				<button className="btn-primary" onClick={() => runExport("all", exportPayrolls())} disabled={downloading !== null}>
					{downloading === "all" ? "다운로드 중" : "엑셀 다운로드"}
				</button>
			</div>

			<div className="stat-grid">
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">이번 달 대상</span></div>
					<div className="stat-value">{totalElements}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">지급완료</span></div>
					<div className="stat-value">{payrolls.filter(p => p.payrollStatusCode === "PAID").length}<span>건</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">확정</span></div>
					<div className="stat-value">{payrolls.filter(p => p.payrollStatusCode === "CONFIRMED").length}<span>건</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">작성중</span></div>
					<div className="stat-value">{payrolls.filter(p => p.payrollStatusCode === "DRAFT").length}<span>건</span></div>
				</div>
			</div>

			<div className="split">
				<div className="card">
					<div className="card-head">
						<div className="card-title">급여 대장 목록</div>
						<span className="foot-info">{totalElements}건</span>
					</div>
					<div className="flex flex-col sm:flex-row flex-wrap gap-2 p-4 border-b border-slate-100">
						<div className="flex gap-2 w-full sm:w-auto">
							<select value={yearMonth} onChange={(e) => setYearMonth(e.target.value)} className="filter-select flex-1 sm:flex-none min-w-0">
								<option value="">전체 급여월</option>
								{options.yearMonths.map((ym) => (
									<option key={ym} value={ym}>{ym}</option>
								))}
							</select>
							<select value={status} onChange={(e) => setStatus(e.target.value)} className="filter-select flex-1 sm:flex-none min-w-0">
								<option value="">전체 상태</option>
								{options.statuses.map((st) => (
									<option key={st} value={st}>{statusLabel(st)}</option>
								))}
							</select>
						</div>
						<div className="flex gap-2 w-full sm:w-auto flex-1">
							<input
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
								onKeyDown={(e) => { if (e.key === "Enter") load(); }}
								placeholder="이름 또는 사번"
								className="filter-input flex-1 min-w-0"
							/>
							<button type="button" className="btn-ghost bg-slate-50 hover:bg-slate-100 shrink-0" onClick={() => load()}>검색</button>
							{(yearMonth || status || keyword) && (
								<button
									type="button"
									className="filter-reset shrink-0"
									onClick={() => { setYearMonth(""); setStatus(""); setKeyword(""); }}
								>
									초기화
								</button>
							)}
						</div>
					</div>
					<div className="flex-1 overflow-auto">
						<table className="w-full whitespace-nowrap min-w-[600px] hidden lg:table">
							<thead>
								<tr>
									<th>대상자</th>
									<th style={{textAlign: "right"}}>총지급액</th>
									<th style={{textAlign: "right"}}>총공제액</th>
									<th style={{textAlign: "right"}}>실지급액</th>
									<th style={{textAlign: "center"}}>상태</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr className="empty-row"><td colSpan={5}>데이터를 불러오는 중입니다...</td></tr>
								) : payrolls.length === 0 ? (
									<tr className="empty-row"><td colSpan={5}>내역이 없습니다.</td></tr>
								) : (
									payrolls.map((p) => (
										<tr 
											key={p.id} 
											onClick={() => setSelectedPayroll(p)} 
											style={{ cursor: "pointer", background: selectedPayroll?.id === p.id ? "#F1F5F9" : "transparent" }}
										>
											<td>
												<div className="cell-person">
													<div className="avatar-sm">{p.employeeName?.slice(0, 1) || "-"}</div>
													<div>
														<div className="p-name">{p.employeeName}</div>
														<div className="p-sub">{p.departmentName}</div>
													</div>
												</div>
											</td>
											<td style={{textAlign: "right"}} className="mono">{formatCurrency(p.totalPayAmount)}</td>
											<td style={{textAlign: "right", color: "#DC2626"}} className="mono">-{formatCurrency(p.totalDeductionAmount)}</td>
											<td style={{textAlign: "right", fontWeight: "bold"}} className="mono">{formatCurrency(p.realPayAmount)}</td>
											<td style={{textAlign: "center"}}>{getStatusPill(p.payrollStatusCode)}</td>
										</tr>
									))
								)}
							</tbody>
						</table>

						{/* Mobile Card View */}
						<div className="lg:hidden flex flex-col gap-4 p-4 bg-slate-50/50">
							{loading ? (
								<div className="text-center text-slate-400 py-8 text-sm">데이터를 불러오는 중입니다...</div>
							) : payrolls.length === 0 ? (
								<div className="text-center text-slate-400 py-8 text-sm">내역이 없습니다.</div>
							) : (
								payrolls.map((p) => (
									<div 
										key={p.id} 
										onClick={() => setSelectedPayroll(p)} 
										className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer transition-colors ${selectedPayroll?.id === p.id ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500' : 'border-slate-200'}`}
									>
										<div className="flex justify-between items-start border-b border-slate-100 pb-3">
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm flex-shrink-0">
													{p.employeeName?.slice(0, 1) || "-"}
												</div>
												<div className="flex flex-col">
													<span className="font-bold text-slate-900">{p.employeeName}</span>
													<span className="text-slate-500 text-xs">{p.departmentName}</span>
												</div>
											</div>
											<div className="scale-90 origin-top-right">
												{getStatusPill(p.payrollStatusCode)}
											</div>
										</div>
										
										<div className="flex justify-between items-center text-sm pt-1">
											<span className="text-slate-500 font-medium">총지급액</span>
											<span className="font-mono text-slate-700">{formatCurrency(p.totalPayAmount)}원</span>
										</div>
										<div className="flex justify-between items-center text-sm">
											<span className="text-slate-500 font-medium">총공제액</span>
											<span className="font-mono text-red-600">-{formatCurrency(p.totalDeductionAmount)}원</span>
										</div>
										<div className="flex justify-between items-center text-sm bg-indigo-50/50 p-2 rounded-lg mt-1 border border-indigo-100/50">
											<span className="text-indigo-900 font-bold">실지급액</span>
											<span className="font-mono font-bold text-indigo-700 text-base">{formatCurrency(p.realPayAmount)}원</span>
										</div>
									</div>
								))
							)}
						</div>
					</div>
					<div className="table-foot">
						<span className="foot-info">전체 {totalElements}건 중 1–{payrolls.length}건 표시</span>
					</div>
				</div>

				{selectedPayroll && (
					<div className="card">
						<div className="panel">
							<div className="panel-eyebrow">급여 상세</div>
							<div className="panel-avatar">{selectedPayroll.employeeName?.slice(0, 1) || "-"}</div>
							<div className="panel-name">{selectedPayroll.employeeName}</div>
							<div className="panel-role">{selectedPayroll.departmentName} · {selectedPayroll.positionName}</div>
							
							<div className="field-row" style={{marginTop: "16px"}}>
								<span className="field-label">정산 월</span>
								<span className="field-value mono">{selectedPayroll.payrollYearMonth}</span>
							</div>
							<div className="field-row">
								<span className="field-label">지급 상태</span>
								<span className="field-value">{getStatusPill(selectedPayroll.payrollStatusCode)}</span>
							</div>

							<div className="mini-stats" style={{marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px"}}>
								<div className="field-row" style={{background: "#F7F8FA", padding: "12px", borderRadius: "10px", borderBottom: "none"}}>
									<span className="field-label">총 지급액</span>
									<span className="field-value mono" style={{fontSize: "14px"}}>{formatCurrency(selectedPayroll.totalPayAmount)}원</span>
								</div>
								<div className="field-row" style={{background: "#F7F8FA", padding: "12px", borderRadius: "10px", borderBottom: "none"}}>
									<span className="field-label">총 공제액</span>
									<span className="field-value mono" style={{color: "#DC2626", fontSize: "14px"}}>-{formatCurrency(selectedPayroll.totalDeductionAmount)}원</span>
								</div>
								<div className="field-row" style={{background: "#EAF0FF", padding: "12px", borderRadius: "10px", borderBottom: "none"}}>
									<span className="field-label" style={{color: "#1F3A8F", fontWeight: "bold"}}>실지급액</span>
									<span className="field-value mono" style={{color: "#1F3A8F", fontSize: "16px"}}>{formatCurrency(selectedPayroll.realPayAmount)}원</span>
								</div>
							</div>
							
							<div style={{marginTop: "auto", paddingTop: "20px"}}>
								<button className="btn-outline" onClick={() => runExport("one", exportPayroll(selectedPayroll.id))} disabled={downloading !== null}>
									{downloading === "one" ? "다운로드 중" : "상세 엑셀 다운로드"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
