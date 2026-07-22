"use client";

import { useEffect, useState } from "react";
import { getPendingSignups, approveSignup, rejectSignup, type PendingSignup } from "@/lib/api/auth";
import { listOpenSlots } from "@/lib/api/slots";
import { ApiError } from "@/lib/api/client";
import type { ApprovalSlot } from "@/lib/types/signup";

function slotLabel(s: ApprovalSlot): string {
	const cat = s.staffCategory === "FACULTY" ? "교원" : "직원";
	const role = s.role === "ADMIN" ? "관리자" : "일반";
	return `${s.departmentName} · ${s.positionName} · ${cat} · ${role}${s.label ? ` (${s.label})` : ""}`;
}

export function SignupApprovalModal({ onClose, onApproved }: { onClose: () => void; onApproved?: () => void }) {
	const [pending, setPending] = useState<PendingSignup[]>([]);
	const [slots, setSlots] = useState<ApprovalSlot[]>([]);
	const [selectedSlot, setSelectedSlot] = useState<Record<number, string>>({});
	const [loading, setLoading] = useState(true);

	function reloadSlots() {
		listOpenSlots().then(setSlots).catch(() => setSlots([]));
	}

	useEffect(() => {
		let active = true;
		Promise.all([getPendingSignups(), listOpenSlots()])
			.then(([reqs, sls]) => {
				if (!active) return;
				setPending(reqs);
				setSlots(sls);
			})
			.catch(() => { if (active) { setPending([]); setSlots([]); } })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, []);

	const handleApprove = async (id: number) => {
		const slotId = selectedSlot[id];
		if (!slotId) {
			alert("매칭할 자리를 먼저 선택하세요. (자리는 '교직원 등록'에서 만들 수 있습니다)");
			return;
		}
		if (!confirm("선택한 자리로 이 교직원의 가입을 승인하시겠습니까? 승인 시 로그인 가능한 계정이 생성됩니다.")) return;
		try {
			await approveSignup(id, Number(slotId));
			setPending((prev) => prev.filter((p) => p.id !== id));
			reloadSlots(); // 매칭된 자리는 목록에서 빠짐
			onApproved?.(); // 승인 즉시 교직원 목록 새로고침
			alert("승인되었습니다. 해당 교직원이 로그인할 수 있습니다.");
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "승인 처리에 실패했습니다.");
		}
	};

	const handleReject = async (id: number) => {
		if (!confirm("해당 교직원의 가입을 거절하시겠습니까?")) return;
		try {
			await rejectSignup(id);
			setPending((prev) => prev.filter((p) => p.id !== id));
			alert("거절되었습니다.");
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "거절 처리에 실패했습니다.");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
			<div className="w-[880px] max-w-[95vw] rounded-lg bg-white p-6 shadow-xl relative max-h-[85vh] flex flex-col">
				<div className="mb-1 flex items-center justify-between">
					<h2 className="text-xl font-bold text-gray-900">교직원 가입 승인</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none text-2xl leading-none">&times;</button>
				</div>
				<p className="mb-4 text-sm text-gray-500">
					신청건을 <b>자리(직위·권한)</b>와 매칭해 승인합니다. 자리가 없으면 먼저 <b>&lsquo;교직원 등록&rsquo;</b>에서 자리를 만드세요.
				</p>

				<div className="flex-1 overflow-y-auto">
					{loading ? (
						<div className="py-8 text-center text-sm text-gray-500">목록을 불러오는 중...</div>
					) : pending.length === 0 ? (
						<div className="py-8 text-center text-sm text-gray-500">대기 중인 가입 신청이 없습니다.</div>
					) : (
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="py-2 px-2 text-sm font-semibold text-gray-600 whitespace-nowrap">이름</th>
									<th className="py-2 px-2 text-sm font-semibold text-gray-600 whitespace-nowrap">아이디/이메일</th>
									<th className="py-2 px-2 text-sm font-semibold text-gray-600 whitespace-nowrap">학교명</th>
									<th className="py-2 px-2 text-sm font-semibold text-gray-600 whitespace-nowrap">신청일</th>
									<th className="py-2 px-2 text-sm font-semibold text-gray-600 min-w-[220px]">매칭할 자리</th>
									<th className="py-2 px-2 text-sm font-semibold text-gray-600 text-center whitespace-nowrap">관리</th>
								</tr>
							</thead>
							<tbody>
								{pending.map((p) => (
									<tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors align-middle">
										<td className="py-3 px-2 text-sm font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
										<td className="py-3 px-2 text-sm text-gray-600 whitespace-nowrap">{p.email}</td>
										<td className="py-3 px-2 text-sm text-gray-500 whitespace-nowrap">{p.school}</td>
										<td className="py-3 px-2 text-sm text-gray-500 whitespace-nowrap">{p.requestedAt?.slice(0, 10)}</td>
										<td className="py-3 px-2 text-sm">
											{slots.length === 0 ? (
												<span className="text-xs text-red-500">등록된 자리 없음 — &lsquo;교직원 등록&rsquo;에서 생성</span>
											) : (
												<select
													value={selectedSlot[p.id] ?? ""}
													onChange={(e) => setSelectedSlot((prev) => ({ ...prev, [p.id]: e.target.value }))}
													className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
												>
													<option value="">자리 선택</option>
													{slots.map((s) => (
														<option key={s.id} value={s.id}>{slotLabel(s)}</option>
													))}
												</select>
											)}
										</td>
										<td className="py-3 px-2 text-sm text-center whitespace-nowrap">
											<div className="flex justify-center gap-1.5">
												<button onClick={() => handleApprove(p.id)} className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors">승인</button>
												<button onClick={() => handleReject(p.id)} className="px-2.5 py-1 bg-white text-red-600 border border-red-200 rounded text-xs font-medium hover:bg-red-50 transition-colors">거절</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>

				<div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
					매칭 가능한 자리: <b className="text-gray-600">{slots.length}</b>개
				</div>
			</div>
		</div>
	);
}
