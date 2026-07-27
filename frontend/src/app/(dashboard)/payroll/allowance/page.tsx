"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { listAllowances, createAllowance, type Allowance } from "@/lib/api/allowance";
import { ApiError } from "@/lib/api/client";

export default function AllowancePage() {
	const [allowances, setAllowances] = useState<Allowance[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);

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
		<div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between bg-gradient-to-r from-emerald-50 to-white p-6 rounded-2xl shadow-sm border border-emerald-100/50 gap-4">
				<div>
					<nav className="mb-2 text-xs font-semibold text-emerald-600 tracking-wider uppercase">
						Salary Management <span className="mx-2 text-emerald-300">/</span> Allowances
					</nav>
					<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">수당 관리</h1>
					<p className="mt-2 text-sm text-slate-600 font-medium">급여에 적용되는 고정 및 변동 수당 항목을 손쉽게 설정하세요.</p>
				</div>
				<Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 transition-all font-semibold px-6 py-2">
					+ 신규 수당 등록
				</Button>
			</div>

			{/* List Container */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
				<div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
					<h2 className="text-lg font-bold text-slate-900">등록된 수당 목록</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm whitespace-nowrap">
						<thead className="bg-white text-slate-400 border-b border-slate-100">
							<tr>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">수당 ID</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">수당명</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase text-center">과세 여부</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase text-center">지급 형태</th>
								<th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase text-right">관리</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-50">
							{loading ? (
								<tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">데이터를 불러오는 중입니다...</td></tr>
							) : allowances.length === 0 ? (
								<tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">등록된 수당 내역이 없습니다.</td></tr>
							) : (
								allowances.map((a) => (
									<tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
										<td className="px-6 py-4 font-semibold text-slate-400">
											<span className="bg-slate-100 px-2 py-1 rounded-md">A{String(a.id).padStart(3, "0")}</span>
										</td>
										<td className="px-6 py-4 font-bold text-slate-800">{a.name}</td>
										<td className="px-6 py-4 text-center">
											{a.taxable ? (
												<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-medium text-xs">
													<div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div> 과세
												</span>
											) : (
												<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-xs">
													<div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> 비과세
												</span>
											)}
										</td>
										<td className="px-6 py-4 text-center">
											{a.fixed ? (
												<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-xs">
													<div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> 매월 고정액
												</span>
											) : (
												<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-medium text-xs">
													<div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div> 변동 지급
												</span>
											)}
										</td>
										<td className="px-6 py-4 text-right">
											<button className="text-slate-400 hover:text-emerald-600 font-medium transition-colors text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
												수정
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal Overlay for Form */}
			{showForm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
					<form onSubmit={submit} className="w-[420px] rounded-2xl bg-white p-7 shadow-2xl animate-in zoom-in-95 duration-200">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-xl font-bold text-slate-900">신규 수당 등록</h2>
							<button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
								&times;
							</button>
						</div>
						
						<div className="space-y-5">
							<div>
								<label className="mb-1.5 block text-sm font-semibold text-slate-700">수당명 <span className="text-rose-500">*</span></label>
								<input
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all"
									placeholder="예: 직책수당, 가족수당"
									required
								/>
							</div>
							
							<div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
								<label className="flex items-center gap-3 cursor-pointer group">
									<div className="relative flex items-center">
										<input type="checkbox" checked={taxable} onChange={(e) => setTaxable(e.target.checked)} className="peer sr-only" />
										<div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 transition-colors"></div>
									</div>
									<div>
										<div className="text-sm font-semibold text-slate-800">과세 대상 포함</div>
										<div className="text-xs text-slate-500 font-medium">소득세 부과 대상 수당 여부</div>
									</div>
								</label>
								
								<label className="flex items-center gap-3 cursor-pointer group">
									<div className="relative flex items-center">
										<input type="checkbox" checked={fixed} onChange={(e) => setFixed(e.target.checked)} className="peer sr-only" />
										<div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 transition-colors"></div>
									</div>
									<div>
										<div className="text-sm font-semibold text-slate-800">고정 수당</div>
										<div className="text-xs text-slate-500 font-medium">매월 고정 금액이 지급되는 수당</div>
									</div>
								</label>
							</div>
						</div>
						
						<div className="mt-8 flex justify-end gap-3">
							<button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">취소</button>
							<button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-60 transition-all">
								{saving ? "처리 중..." : "등록 완료"}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
