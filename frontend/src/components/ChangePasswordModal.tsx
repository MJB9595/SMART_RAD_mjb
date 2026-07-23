"use client";

import { useState } from "react";
import { changeOwnPassword } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";

function EyeToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600"
			aria-label={shown ? "비밀번호 숨기기" : "비밀번호 보기"}
			tabIndex={-1}
		>
			{shown ? "🙈" : "👁"}
		</button>
	);
}

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
	const [current, setCurrent] = useState("");
	const [next, setNext] = useState("");
	const [confirm, setConfirm] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNext, setShowNext] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		if (next.length < 8) {
			setError("새 비밀번호는 8자 이상이어야 합니다.");
			return;
		}
		if (next !== confirm) {
			setError("새 비밀번호가 일치하지 않습니다.");
			return;
		}
		setSaving(true);
		try {
			await changeOwnPassword(current, next);
			alert("비밀번호가 변경되었습니다.");
			onClose();
		} catch (err) {
			setError(err instanceof ApiError ? err.message : "비밀번호 변경에 실패했습니다.");
		} finally {
			setSaving(false);
		}
	}

	const inputCls =
		"w-full rounded-lg border border-slate-300 px-3 py-2 pr-9 text-sm text-slate-900 focus:border-blue-500 focus:outline-none";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
			<form onSubmit={submit} className="w-[420px] max-w-[95vw] rounded-lg bg-white p-6 shadow-xl">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-bold text-slate-900">비밀번호 변경</h2>
					<button type="button" onClick={onClose} className="text-2xl leading-none text-slate-400 hover:text-slate-600">
						&times;
					</button>
				</div>

				<div className="space-y-3">
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">현재 비밀번호</label>
						<div className="relative">
							<input
								type={showCurrent ? "text" : "password"}
								value={current}
								onChange={(e) => setCurrent(e.target.value)}
								className={inputCls}
								autoComplete="current-password"
								required
							/>
							<EyeToggle shown={showCurrent} onToggle={() => setShowCurrent((v) => !v)} />
						</div>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">새 비밀번호 (8자 이상)</label>
						<div className="relative">
							<input
								type={showNext ? "text" : "password"}
								value={next}
								onChange={(e) => setNext(e.target.value)}
								className={inputCls}
								autoComplete="new-password"
								required
							/>
							<EyeToggle shown={showNext} onToggle={() => setShowNext((v) => !v)} />
						</div>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-slate-700">새 비밀번호 확인</label>
						<div className="relative">
							<input
								type={showConfirm ? "text" : "password"}
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								className={inputCls}
								autoComplete="new-password"
								required
							/>
							<EyeToggle shown={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
						</div>
					</div>
				</div>

				{error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}

				<div className="mt-5 flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
					>
						취소
					</button>
					<button
						type="submit"
						disabled={saving}
						className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
					>
						{saving ? "변경 중..." : "변경"}
					</button>
				</div>
			</form>
		</div>
	);
}
