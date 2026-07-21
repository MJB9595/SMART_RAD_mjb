"use client";

import { useEffect, useState } from "react";
import { getPendingSignups, approveSignup, rejectSignup, type PendingSignup } from "@/lib/api/auth";

export function SignupApprovalModal({ onClose }: { onClose: () => void }) {
	const [pending, setPending] = useState<PendingSignup[]>([]);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		let active = true;
		getPendingSignups().then(data => {
			if (active) {
				setPending(data);
				setLoading(false);
			}
		});
		return () => { active = false; };
	}, []);

	const handleApprove = async (id: string) => {
		if (!confirm("해당 교직원의 가입을 승인하시겠습니까?")) return;
		await approveSignup(id);
		setPending(prev => prev.filter(p => p.id !== id));
		alert("승인되었습니다.");
	};

	const handleReject = async (id: string) => {
		if (!confirm("해당 교직원의 가입을 거절하시겠습니까?")) return;
		await rejectSignup(id);
		setPending(prev => prev.filter(p => p.id !== id));
		alert("거절되었습니다.");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<div className="w-[600px] rounded-lg bg-white p-6 shadow-xl relative max-h-[80vh] flex flex-col">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-xl font-bold text-gray-900">교직원 가입 승인</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none text-2xl leading-none">&times;</button>
				</div>
				
				<div className="flex-1 overflow-y-auto">
					{loading ? (
						<div className="py-8 text-center text-sm text-gray-500">목록을 불러오는 중...</div>
					) : pending.length === 0 ? (
						<div className="py-8 text-center text-sm text-gray-500">대기 중인 가입 신청이 없습니다.</div>
					) : (
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="py-2 px-2 text-sm font-semibold text-gray-600">이름</th>
									<th className="py-2 px-2 text-sm font-semibold text-gray-600">아이디/이메일</th>
									<th className="py-2 px-2 text-sm font-semibold text-gray-600">학교명</th>
									<th className="py-2 px-2 text-sm font-semibold text-gray-600">신청일</th>
									<th className="py-2 px-2 text-sm font-semibold text-gray-600 text-center">관리</th>
								</tr>
							</thead>
							<tbody>
								{pending.map((p) => (
									<tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
										<td className="py-3 px-2 text-sm font-medium text-gray-900">{p.name}</td>
										<td className="py-3 px-2 text-sm text-gray-600">{p.email}</td>
										<td className="py-3 px-2 text-sm text-gray-500">{p.school}</td>
										<td className="py-3 px-2 text-sm text-gray-500">{p.requestedAt}</td>
										<td className="py-3 px-2 text-sm text-center">
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
			</div>
		</div>
	);
}
