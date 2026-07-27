"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { listAllowances, createAllowance, type Allowance } from "@/lib/api/allowance";
import { ApiError } from "@/lib/api/client";

export default function AllowancePage() {
	const [allowances, setAllowances] = useState<Allowance[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);

	// 등록 폼 상태
	const [name, setName] = useState("");
	const [taxable, setTaxable] = useState(true);
	const [fixed, setFixed] = useState(true);
	const [saving, setSaving] = useState(false);

	function reload() {
		setLoading(true);
		listAllowances()
			.then(setAllowances)
			.catch(() => setAllowances([]))
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		reload();
	}, []);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		setSaving(true);
		try {
			await createAllowance({ name: name.trim(), taxable, fixed });
			setShowForm(false);
			setName("");
			setTaxable(true);
			setFixed(true);
			reload();
		} catch (err) {
			alert(err instanceof ApiError ? err.message : "수당 등록에 실패했습니다.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				급여 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">수당 관리</span>
			</nav>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">수당 관리</h1>
					<p className="mt-1 text-sm text-slate-500">급여에 적용되는 수당 항목 및 속성을 관리합니다.</p>
				</div>
				<Button onClick={() => setShowForm(true)}>수당 등록</Button>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
							<th className="p-3 font-medium">수당 ID</th>
							<th className="p-3 font-medium">수당명</th>
							<th className="p-3 font-medium text-center">과세 여부</th>
							<th className="p-3 font-medium text-center">고정 여부</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td colSpan={4} className="p-6 text-center text-slate-400">불러오는 중...</td></tr>
						) : allowances.length === 0 ? (
							<tr><td colSpan={4} className="p-6 text-center text-slate-400">등록된 수당이 없습니다.</td></tr>
						) : (
							allowances.map((a) => (
								<tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
									<td className="p-3 font-medium text-slate-500">A{String(a.id).padStart(3, "0")}</td>
									<td className="p-3 font-medium text-slate-900">{a.name}</td>
									<td className="p-3 text-center">
										{a.taxable ? (
											<span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">과세</span>
										) : (
											<span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">비과세</span>
										)}
									</td>
									<td className="p-3 text-center">
										{a.fixed ? (
											<span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">고정수당</span>
										) : (
											<span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">변동수당</span>
										)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{showForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
					<form onSubmit={submit} className="w-[400px] max-w-[95vw] rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-bold text-slate-900">수당 등록</h2>
							<button type="button" onClick={() => setShowForm(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-600">&times;</button>
						</div>
						<div className="space-y-3">
							<div>
								<label className="mb-1 block text-sm font-medium text-slate-700">수당명</label>
								<input
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
									placeholder="예: 직책수당"
									required
								/>
							</div>
							<label className="flex items-center gap-2 text-sm text-slate-700">
								<input type="checkbox" checked={taxable} onChange={(e) => setTaxable(e.target.checked)} />
								과세 대상
							</label>
							<label className="flex items-center gap-2 text-sm text-slate-700">
								<input type="checkbox" checked={fixed} onChange={(e) => setFixed(e.target.checked)} />
								고정 수당 (매월 정액)
							</label>
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
