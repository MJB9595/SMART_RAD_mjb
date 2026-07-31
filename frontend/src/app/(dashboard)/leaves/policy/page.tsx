"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { listLeavePolicies, createLeavePolicy, type LeavePolicy } from "@/lib/api/leaves";
import { listPositions } from "@/lib/api/meta";
import type { Position } from "@/lib/types/meta";
import { ApiError } from "@/lib/api/client";
import { useFeedback } from "@/components/feedback/FeedbackProvider";

export default function LeavePolicyPage() {
	const { notify, confirm: askConfirm } = useFeedback();
	const [policies, setPolicies] = useState<LeavePolicy[]>([]);
	const [positions, setPositions] = useState<Position[]>([]);
	const [posName, setPosName] = useState<Record<number, string>>({});
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);

	// 등록 폼 상태
	const [positionId, setPositionId] = useState("");
	const [annual, setAnnual] = useState("15");
	const [carryOver, setCarryOver] = useState("5");
	const [halfDay, setHalfDay] = useState(true);
	const [note, setNote] = useState("");
	const [saving, setSaving] = useState(false);

	function reload() {
		setLoading(true);
		Promise.all([listLeavePolicies(), listPositions()])
			.then(([pols, poss]) => {
				setPolicies(pols);
				setPositions(poss);
				setPosName(Object.fromEntries(poss.map((p) => [p.id, p.name])));
			})
			.catch(() => setPolicies([]))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		reload();
	}, []);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!positionId) {
			notify("적용 직급을 선택하세요.", "error");
			return;
		}
		setSaving(true);
		try {
			await createLeavePolicy({
				positionId: Number(positionId),
				annualLeaveDays: Number(annual),
				maxCarryOverDays: Number(carryOver),
				halfDayAllowed: halfDay,
				note: note.trim() || null,
			});
			setShowForm(false);
			setPositionId("");
			setAnnual("15");
			setCarryOver("5");
			setHalfDay(true);
			setNote("");
			reload();
		} catch (err) {
			notify(err instanceof ApiError ? err.message : "휴가 정책 등록에 실패했습니다.", "error");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				휴가 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">휴가유형·정책 관리</span>
			</nav>
			<div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start sm:gap-0">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">휴가 정책 관리</h1>
					<p className="mt-1 text-sm text-slate-500">직급별 연차 부여 기준 및 이월 한도를 관리합니다.</p>
				</div>
				<Button onClick={() => setShowForm(true)}>새 정책 등록</Button>
			</div>

			<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
				<table className="w-full min-w-[38rem] border-collapse text-sm">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
							<th className="p-3 font-medium">적용 직급</th>
							<th className="p-3 font-medium text-right">기본 연차일수</th>
							<th className="p-3 font-medium text-right">최대 이월한도</th>
							<th className="p-3 font-medium text-center">반차 허용</th>
							<th className="p-3 font-medium">비고</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td colSpan={5} className="p-6 text-center text-slate-400">불러오는 중...</td></tr>
						) : policies.length === 0 ? (
							<tr><td colSpan={5} className="p-6 text-center text-slate-400">등록된 휴가 정책이 없습니다.</td></tr>
						) : (
							policies.map((p) => (
								<tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3 font-medium text-slate-900">{p.positionId ? (posName[p.positionId] ?? `직급#${p.positionId}`) : "전체"}</td>
									<td className="p-3 text-right">{p.annualLeaveDays}일</td>
									<td className="p-3 text-right">{p.maxCarryOverDays}일</td>
									<td className="p-3 text-center">
										{p.halfDayAllowed ? (
											<span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">허용</span>
										) : (
											<span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">불가</span>
										)}
									</td>
									<td className="p-3 text-slate-500">{p.note || "-"}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{showForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
					<form onSubmit={submit} className="max-h-[90vh] w-full max-w-[420px] overflow-y-auto rounded-lg bg-white p-5 shadow-xl sm:p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-bold text-slate-900">휴가 정책 등록</h2>
							<button type="button" onClick={() => setShowForm(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-600">&times;</button>
						</div>
						<div className="space-y-3">
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">적용 직급</label>
								<select value={positionId} onChange={(e) => setPositionId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" required>
									<option value="">직급 선택</option>
									{positions.map((p) => (
										<option key={p.id} value={p.id}>{p.name}</option>
									))}
								</select>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row">
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium text-slate-700">기본 연차일수</label>
									<input type="number" step="0.5" min="0" value={annual} onChange={(e) => setAnnual(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" required />
								</div>
								<div className="flex-1">
									<label className="mb-1 block text-sm font-medium text-slate-700">최대 이월한도</label>
									<input type="number" step="0.5" min="0" value={carryOver} onChange={(e) => setCarryOver(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" required />
								</div>
							</div>
							<label className="flex items-center gap-2 text-sm text-slate-700">
								<input type="checkbox" checked={halfDay} onChange={(e) => setHalfDay(e.target.checked)} />
								반차 허용
							</label>
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">비고</label>
								<input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="선택 입력" />
							</div>
						</div>
						<div className="mt-5 flex justify-end gap-2">
							<button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">취소</button>
							<button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "등록 중..." : "등록"}</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
