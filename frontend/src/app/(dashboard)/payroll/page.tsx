"use client";

import { useEffect, useState } from "react";
import { listPayrolls } from "@/lib/api/payroll";
import type { Payroll } from "@/lib/types/payroll";

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
					<div className="page-title">기초 급여 조회</div>
					<div className="page-sub">근태와 연동된 기초 급여 내역을 조회하고 정산 엑셀로 내려받습니다</div>
				</div>
				<button className="btn-primary">엑셀 다운로드</button>
			</div>

			<div className="stat-grid">
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">이번달 급여 대상</span></div>
					<div className="stat-value">{totalElements}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">정산 완료</span></div>
					<div className="stat-value">{payrolls.filter(p => p.payrollStatusCode === "COMPLETED").length}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">정산 대기</span><span className="badge new">대기</span></div>
					<div className="stat-value">{payrolls.filter(p => p.payrollStatusCode !== "COMPLETED" && p.payrollStatusCode !== "ERROR").length}<span>명</span></div>
				</div>
				<div className="stat-card">
					<div className="stat-top"><span className="stat-label">오류</span></div>
					<div className="stat-value">{payrolls.filter(p => p.payrollStatusCode === "ERROR").length}<span>건</span></div>
				</div>
			</div>

			<div className="split">
				<div className="card">
					<div className="card-head">
						<div className="card-title">급여 정산 목록</div>
						<div className="head-actions">
							<button className="btn-ghost">필터</button>
							<button className="btn-ghost">내보내기</button>
						</div>
					</div>
					<table>
						<thead>
							<tr>
								<th>대상자</th>
								<th>총지급액</th>
								<th>총공제액</th>
								<th>실지급액</th>
								<th>정산상태</th>
							</tr>
						</thead>
						<tbody>
							{payrolls.map((p) => (
								<tr key={p.id} onClick={() => setSelectedPayroll(p)} style={{cursor: 'pointer'}}>
									<td>
										<div className="cell-person">
											<div className="avatar-sm">{p.employeeName?.slice(0, 1) || "-"}</div>
											<div>
												<div className="p-name">{p.employeeName}</div>
												<div className="p-sub">{p.departmentName}</div>
											</div>
										</div>
									</td>
									<td className="mono">{formatCurrency(p.totalPayAmount)}</td>
									<td className="mono text-red-500">-{formatCurrency(p.totalDeductionAmount)}</td>
									<td className="mono font-semibold">{formatCurrency(p.realPayAmount)}</td>
									<td>{getStatusPill(p.payrollStatusCode)}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="table-foot">
						<span className="foot-info">전체 {totalElements}건 중 1–{payrolls.length}건 표시</span>
						<div className="pager">
							<span className="cur">1</span>
						</div>
					</div>
				</div>

				{selectedPayroll && (
					<div className="card">
						<div className="panel">
							<div className="panel-eyebrow">급여 정산 미리보기 · {selectedPayroll.payrollYearMonth}</div>
							<div className="panel-avatar">{selectedPayroll.employeeName?.slice(0, 1) || "-"}</div>
							<div className="panel-name">{selectedPayroll.employeeName}</div>
							<div className="panel-role">{selectedPayroll.departmentName} · {selectedPayroll.positionName}</div>
							
							<div className="field-row">
								<span className="field-label">총 지급액</span>
								<span className="field-value mono">{formatCurrency(selectedPayroll.totalPayAmount)}</span>
							</div>
							<div className="field-row">
								<span className="field-label">총 공제액</span>
								<span className="field-value mono text-red-500">-{formatCurrency(selectedPayroll.totalDeductionAmount)}</span>
							</div>
							
							<div className="mini-stats mt-4">
								<div className="mini-stat"><div className="mini-stat-label">실지급액</div><div className="mini-stat-value text-sm font-bold text-blue-600">{formatCurrency(selectedPayroll.realPayAmount)}</div></div>
								<div className="mini-stat"><div className="mini-stat-label">전월대비</div><div className="mini-stat-value text-sm font-bold">-</div></div>
								<div className="mini-stat"><div className="mini-stat-label">상태</div><div className="mini-stat-value text-sm font-bold">{selectedPayroll.payrollStatusCode === 'COMPLETED' ? '완료' : '대기'}</div></div>
							</div>
							
							<button className="btn-outline mt-6">정산용 엑셀 다운로드</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
