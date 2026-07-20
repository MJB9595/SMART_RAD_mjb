"use client";

import { useState } from "react";

export type FieldType = "text" | "date" | "select" | "checkbox";

export interface FieldDef {
	key: string;
	label: string;
	type?: FieldType;
	required?: boolean;
	full?: boolean;
	options?: { value: string; label: string }[];
	placeholder?: string;
}

export type RecordValues = Record<string, string | boolean | null>;

interface Props {
	title: string;
	fields: FieldDef[];
	initial: RecordValues;
	onClose: () => void;
	onSubmit: (values: RecordValues) => Promise<void>;
}

/** 인사기록 탭 공통 등록/수정 모달. 빈 문자열은 null로 정규화하여 전달한다. */
export function RecordFormModal({ title, fields, initial, onClose, onSubmit }: Props) {
	const [values, setValues] = useState<RecordValues>(initial);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	function set(key: string, value: string | boolean) {
		setValues((v) => ({ ...v, [key]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		for (const f of fields) {
			if (f.required && !String(values[f.key] ?? "").trim()) {
				setError(`${f.label}은(는) 필수입니다.`);
				return;
			}
		}
		const normalized: RecordValues = {};
		for (const f of fields) {
			const raw = values[f.key];
			if (f.type === "checkbox") normalized[f.key] = Boolean(raw);
			else normalized[f.key] = raw === "" || raw == null ? null : raw;
		}
		setSaving(true);
		try {
			await onSubmit(normalized);
		} catch (err) {
			setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
			setSaving(false);
		}
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
				<div className="modal-head">
					<div className="modal-title">{title}</div>
					<button type="button" className="modal-x" onClick={onClose}>×</button>
				</div>
				<div className="modal-body">
					{error && <div className="modal-err">{error}</div>}
					<div className="form-grid">
						{fields.map((f) => {
							const type = f.type ?? "text";
							if (type === "checkbox") {
								return (
									<label key={f.key} className={`form-check ${f.full ? "full" : ""}`} style={f.full ? { gridColumn: "1 / -1" } : undefined}>
										<input type="checkbox" checked={Boolean(values[f.key])} onChange={(e) => set(f.key, e.target.checked)} />
										{f.label}
									</label>
								);
							}
							return (
								<div key={f.key} className={`form-field ${f.full ? "full" : ""}`}>
									<label>{f.label}{f.required && <span className="req">*</span>}</label>
									{type === "select" ? (
										<select value={String(values[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)}>
											<option value="">선택</option>
											{f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
										</select>
									) : (
										<input
											type={type === "date" ? "date" : "text"}
											value={String(values[f.key] ?? "")}
											placeholder={f.placeholder}
											onChange={(e) => set(f.key, e.target.value)}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>
				<div className="modal-foot">
					<button type="button" className="btn-ghost" onClick={onClose}>취소</button>
					<button type="submit" className="btn-primary" disabled={saving}>{saving ? "저장 중..." : "저장"}</button>
				</div>
			</form>
		</div>
	);
}
