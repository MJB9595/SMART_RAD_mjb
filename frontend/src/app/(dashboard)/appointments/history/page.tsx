"use client";

import { useEffect, useMemo, useState } from "react";
import { listAppointments } from "@/lib/api/appointments";
import { ApiError } from "@/lib/api/client";
import { Field, Input, Select } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";
import type { Appointment, AppointmentType } from "@/lib/types/appointment";

const TYPE_LABELS: Record<AppointmentType, string> = {
	HIRE: "임용",
	PROMOTION: "승진",
	TRANSFER: "전보",
	CONCURRENT: "겸직",
};

export default function AppointmentHistoryPage() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [keyword, setKeyword] = useState("");
	const [type, setType] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listAppointments()
			.then((page) => setAppointments(page.content))
			.catch((err) => setError(err instanceof ApiError ? err.message : "발령 이력을 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	// 이력 조회 = 승인 완료된 발령만
	const filtered = useMemo(
		() =>
			appointments.filter(
				(a) =>
					a.approvalStatus === "APPROVED" &&
					(!keyword || a.employeeName.includes(keyword) || a.employeeNumber.includes(keyword)) &&
					(!type || a.appointmentType === type),
			),
		[appointments, keyword, type],
	);

	return (
		<div className="content">
			<div className="breadcrumb">
				발령 관리 <b>›</b> 발령 이력 조회
			</div>
			
			<div className="title-row">
				<div>
					<h1 className="page-title">발령 이력 조회</h1>
					<div className="page-sub">승인 완료 및 반려된 전체 인사발령 이력을 조회합니다.</div>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-3 mb-6">
				<div className="w-full sm:w-[260px]">
					<Input placeholder="이름 또는 사번 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
				</div>
				<div className="w-full sm:w-[180px]">
					<Select value={type} onChange={(e) => setType(e.target.value)}>
						<option value="">발령구분 전체</option>
						<option value="HIRE">임용</option>
						<option value="PROMOTION">승진</option>
						<option value="TRANSFER">전보</option>
						<option value="CONCURRENT">겸직</option>
					</Select>
				</div>
			</div>

			<div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
				<div className="card-head">
					<div className="card-title">발령 이력 목록</div>
					<div className="text-sm font-bold text-slate-400">총 {filtered.length}건</div>
				</div>

				<div style={{ flex: 1, overflowY: 'auto' }}>
					{loading ? (
						<div className="p-8 text-center text-sm text-slate-500 font-bold">불러오는 중...</div>
					) : error ? (
						<div className="p-8 text-center text-sm text-red-500 font-bold">{error}</div>
					) : filtered.length === 0 ? (
						<div className="p-8 text-center text-sm text-slate-400 font-bold">발령 이력이 없습니다.</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full whitespace-nowrap min-w-[600px] hidden lg:table">
								<thead>
									<tr>
										<th>발령번호</th>
										<th>대상자</th>
										<th>발령구분</th>
										<th>이전 소속/직급</th>
										<th>이후 소속/직급</th>
										<th>발령일</th>
										<th>상태</th>
									</tr>
								</thead>
								<tbody>
									{filtered.map((a) => (
										<tr key={a.id} className="hover:bg-slate-50 transition-colors">
											<td className="font-mono text-xs">{a.documentNumber}</td>
											<td>
												<div className="cell-person">
													<div className="avatar-sm">{a.employeeName.slice(0, 1)}</div>
													<div>
														<div className="p-name">{a.employeeName}</div>
														<div className="p-sub">{a.employeeNumber}</div>
													</div>
												</div>
											</td>
											<td>
												<span className={`pill ${a.appointmentType === 'HIRE' ? 'amber' : a.appointmentType === 'TRANSFER' ? 'blue' : 'green'}`}>
													{TYPE_LABELS[a.appointmentType]}
												</span>
											</td>
											<td>
												<div className="font-bold text-slate-700">{a.fromDepartmentName ?? "-"}</div>
												<div className="text-xs text-slate-400">{a.fromPositionName ?? "-"}</div>
											</td>
											<td>
												<div className="font-bold text-slate-700">{a.toDepartmentName ?? "-"}</div>
												<div className="text-xs text-slate-400">{a.toPositionName ?? "-"}</div>
											</td>
											<td className="font-mono text-[13px]">{a.appointmentDate}</td>
											<td><StatusBadge status={a.approvalStatus} /></td>
										</tr>
									))}
								</tbody>
							</table>

							{/* Mobile Card View */}
							<div className="lg:hidden flex flex-col gap-3 p-4 bg-slate-50/50">
								{filtered.map((a) => (
									<div key={a.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
										<div className="flex justify-between items-start border-b border-slate-100 pb-3">
											<div className="flex items-center gap-3">
												<div className="avatar-sm flex-shrink-0">{a.employeeName.slice(0, 1)}</div>
												<div>
													<div className="font-bold text-slate-900">{a.employeeName}</div>
													<div className="text-xs text-slate-500 mt-0.5">{a.employeeNumber}</div>
												</div>
											</div>
											<div className="flex flex-col items-end gap-1.5 flex-shrink-0">
												<div className="scale-90 origin-top-right"><StatusBadge status={a.approvalStatus} /></div>
												<div className="scale-90 origin-top-right">
													<span className={`pill ${a.appointmentType === 'HIRE' ? 'amber' : a.appointmentType === 'TRANSFER' ? 'blue' : 'green'}`}>
														{TYPE_LABELS[a.appointmentType]}
													</span>
												</div>
											</div>
										</div>
										<div className="flex flex-col gap-2 pt-1 pb-2 border-b border-slate-100">
											<div className="flex items-center justify-between">
												<span className="text-xs text-slate-400 font-medium w-16">발령 전</span>
												<span className="text-sm text-slate-700 font-medium text-right">{a.fromDepartmentName || "-"} {a.fromPositionName || "-"}</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-xs text-slate-400 font-medium w-16">발령 후</span>
												<span className="text-sm text-slate-700 font-medium text-right">{a.toDepartmentName || "-"} {a.toPositionName || "-"}</span>
											</div>
										</div>
										<div className="flex justify-between items-center text-sm pt-1">
											<span className="text-slate-500 font-medium">발령번호</span>
											<span className="font-mono text-slate-700">{a.documentNumber}</span>
										</div>
										<div className="flex justify-between items-center text-sm pb-1">
											<span className="text-slate-500 font-medium">발령일</span>
											<span className="font-mono text-slate-700">{a.appointmentDate}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
