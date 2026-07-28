"use client";

import { useEffect, useState } from "react";
import { exportPayroll, exportPayrolls, listPayrolls } from "@/lib/api/payroll";
import type { Payroll } from "@/lib/types/payroll";

export default function PayrollPage() {
	const [payrolls, setPayrolls] = useState<Payroll[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [loading, setLoading] = useState(true);
	const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
	const [downloading, setDownloading] = useState<"all" | "one" | null>(null);

	function runExport(kind: "all" | "one", task: Promise<void>) {
		setDownloading(kind);
		task
			.catch((error) => {
				alert(error instanceof Error ? error.message : "엑셀 다운로드에 실패했습니다.");
			})
			.finally(() => setDownloading(null));
	}

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
		if (status === "COMPLETED") return <span className="pill green">정산완료</span>;
		if (status === "PENDING") return <span className="pill amber">정산대기</span>;
		if (status === "ERROR") return <span className="pill red">오류</span>;
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
					<div className="stat-top"><span className="stat-label">정산 완료</span></div>
					<div className="stat-value">{payrolls.filter(p => p.payrollStatusCode === "COMPLETED").length}<span>건</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">정산 대기</span></div>
					<div className="stat-value">{payrolls.filter(p => p.payrollStatusCode !== "COMPLETED" && p.payrollStatusCode !== "ERROR").length}<span>건</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">정산 오류</span><span className="badge down">주의</span></div>
					<div className="stat-value">{payrolls.filter(p => p.payrollStatusCode === "ERROR").length}<span>건</span></div>
				</div>
			</div>

			<div className="split">
				<div className="card">
					<div className="card-head">
						<div className="card-title">급여 대장 목록</div>
						<div className="head-actions">
							<button className="btn-sm">필터</button>
						</div>
					</div>
					<div className="flex-1 overflow-auto">
						<table>
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
