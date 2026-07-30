"use client";

import { useEffect, useState } from "react";
import {
	listRoles,
	listPermissions,
	createRole,
	updateRole,
	setRoleActive,
	deleteRole,
} from "@/lib/api/system";
import { ApiError } from "@/lib/api/client";
import type { PermissionInfo, RoleInfo } from "@/lib/types/system";
import { Shield, ShieldCheck, Users, User, CheckCircle2, XCircle, Key, Activity, Wallet, FileText, Settings, Clock, Plus, Trash2, Pencil } from "lucide-react";

/** 최고 관리자 역할은 잠금(백엔드와 동일 규칙) — 수정·삭제·비활성 불가 */
const PROTECTED_ROLE_CODE = "ROLE_ADMIN";

const getRoleIcon = (code: string, cls = "w-6 h-6") => {
	switch (code) {
		case "ROLE_ADMIN": return <Shield className={`${cls} text-indigo-600`} />;
		case "ROLE_HR": return <Users className={`${cls} text-emerald-600`} />;
		case "ROLE_USER": return <User className={`${cls} text-blue-600`} />;
		default: return <ShieldCheck className={`${cls} text-slate-600`} />;
	}
};

const getRoleTextColor = (code: string) => {
	switch (code) {
		case "ROLE_ADMIN": return "text-indigo-700";
		case "ROLE_HR": return "text-emerald-700";
		case "ROLE_USER": return "text-blue-700";
		default: return "text-slate-700";
	}
};

/** 업무 모듈 ← 그 모듈을 여는 권한 코드. 새로 만든 역할도 부여 권한만으로 판정되도록 매핑해 둔다. */
const FEATURES = [
	{ id: "employees", name: "인사기록 관리", icon: <User className="w-4 h-4" />, perms: ["EMPLOYEE_READ", "EMPLOYEE_WRITE"] },
	{ id: "appointments", name: "인사발령 관리", icon: <FileText className="w-4 h-4" />, perms: ["APPOINTMENT_APPROVE"] },
	{ id: "attendance", name: "근태·휴가 관리", icon: <Clock className="w-4 h-4" />, perms: ["LEAVE_APPROVE"] },
	{ id: "payroll", name: "급여/수당 관리", icon: <Wallet className="w-4 h-4" />, perms: ["PAYROLL_READ"] },
	{ id: "welfare", name: "복지·증명 관리", icon: <Activity className="w-4 h-4" />, perms: ["EMPLOYEE_READ"] },
	{ id: "system", name: "시스템 권한 관리", icon: <Settings className="w-4 h-4" />, perms: ["SYSTEM_MANAGE"] },
];

/** 최고 관리자는 무조건 전체 개방, 나머지는 실제로 부여된 권한에서 파생한다. */
const grantingPermissions = (role: RoleInfo, perms: string[]) =>
	role.code === PROTECTED_ROLE_CODE ? perms : perms.filter((p) => role.permissions.includes(p));

type FormState = { id: number | null; code: string; name: string; description: string; permissionCodes: string[] };
const EMPTY_FORM: FormState = { id: null, code: "ROLE_", name: "", description: "", permissionCodes: [] };

export default function RolesPage() {
	const [roles, setRoles] = useState<RoleInfo[]>([]);
	const [permissions, setPermissions] = useState<PermissionInfo[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [form, setForm] = useState<FormState | null>(null);
	const [saving, setSaving] = useState(false);
	/** 실패 사유는 네이티브 alert 대신 화면 상단 배너로 — 관리자가 원인을 읽고 바로 고칠 수 있어야 한다. */
	const [notice, setNotice] = useState<string | null>(null);
	const [pendingDelete, setPendingDelete] = useState<RoleInfo | null>(null);
	/** 아직 서버에 보내지 않은 비활성/삭제 예약. roleId → 예약 내용. */
	const [pending, setPending] = useState<Record<number, { active?: boolean; remove?: boolean }>>({});
	const [applying, setApplying] = useState(false);

	const messageOf = (err: unknown, fallback: string) => (err instanceof ApiError ? err.message : fallback);

	const selectedRole = roles.find((r) => r.id === selectedId) ?? null;

	function reload(keepId?: number | null) {
		return listRoles()
			.then((data) => {
				setRoles(data);
				setSelectedId((prev) => {
					const want = keepId ?? prev;
					return data.some((r) => r.id === want) ? (want as number) : (data[0]?.id ?? null);
				});
			})
			.catch((err) => setError(err instanceof ApiError ? err.message : "권한 정보를 불러오지 못했습니다."));
	}

	useEffect(() => {
		Promise.all([reload(), listPermissions().then(setPermissions).catch(() => setPermissions([]))])
			.finally(() => setLoading(false));
	}, []);

	function openCreate() {
		setForm({ ...EMPTY_FORM });
	}

	function openEdit(role: RoleInfo) {
		setForm({
			id: role.id,
			code: role.code,
			name: role.name,
			description: role.description ?? "",
			permissionCodes: [...role.permissions],
		});
	}

	function togglePermission(code: string) {
		setForm((f) => {
			if (!f) return f;
			const has = f.permissionCodes.includes(code);
			return { ...f, permissionCodes: has ? f.permissionCodes.filter((c) => c !== code) : [...f.permissionCodes, code] };
		});
	}

	async function submitForm(e: React.FormEvent) {
		e.preventDefault();
		if (!form) return;
		setSaving(true);
		setNotice(null);
		try {
			const body = {
				code: form.code.trim(),
				name: form.name.trim(),
				description: form.description.trim() || null,
				permissionCodes: form.permissionCodes,
			};
			const saved = form.id === null ? await createRole(body) : await updateRole(form.id, body);
			setForm(null);
			await reload(saved.id);
		} catch (err) {
			setNotice(messageOf(err, "저장에 실패했습니다."));
		} finally {
			setSaving(false);
		}
	}

	/** 비활성/삭제는 즉시 반영하지 않고 여기 쌓아 두었다가 '적용'을 눌러야 서버에 보낸다. */
	function stageToggleActive(role: RoleInfo) {
		setNotice(null);
		setPending((prev) => {
			const next = { ...prev };
			const op = { ...(next[role.id] ?? {}) };
			const current = op.active ?? role.active;
			op.active = !current;
			// 원래 상태로 되돌아왔고 삭제 예약도 없으면 변경 목록에서 빼 준다
			if (op.active === role.active && !op.remove) {
				delete next[role.id];
			} else {
				next[role.id] = op;
			}
			return next;
		});
	}

	function stageDelete(role: RoleInfo) {
		setPendingDelete(null);
		setNotice(null);
		setPending((prev) => ({ ...prev, [role.id]: { ...(prev[role.id] ?? {}), remove: true } }));
	}

	function revertPending() {
		setPending({});
		setNotice(null);
	}

	/** 쌓아 둔 변경을 한 번에 반영. 하나라도 실패하면 사유를 보여주고 나머지는 그대로 둔다. */
	async function applyPending() {
		setApplying(true);
		setNotice(null);
		const failures: string[] = [];
		for (const [id, op] of Object.entries(pending)) {
			const role = roles.find((r) => r.id === Number(id));
			if (!role) continue;
			try {
				if (op.remove) {
					await deleteRole(role.id);
				} else if (op.active !== undefined) {
					await setRoleActive(role.id, op.active);
				}
			} catch (err) {
				failures.push(`${role.name}: ${messageOf(err, "적용 실패")}`);
			}
		}
		setPending({});
		await reload(null);
		setApplying(false);
		if (failures.length > 0) {
			setNotice(failures.join(" / "));
		}
	}

	const isProtected = (code: string) => code === PROTECTED_ROLE_CODE;
	const pendingCount = Object.keys(pending).length;
	/** 화면에 보여 줄 활성 상태 — 쌓아 둔 변경이 있으면 그걸 우선한다. */
	const shownActive = (role: RoleInfo) => pending[role.id]?.active ?? role.active;
	const isStagedRemove = (role: RoleInfo) => !!pending[role.id]?.remove;

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title flex items-center gap-2">
						<Key className="w-6 h-6 text-indigo-600" />
						권한 관리 (RBAC)
					</div>
					<div className="page-sub">역할을 만들고 권한을 부여합니다. 좌측에서 역할을 선택하면 상세 권한이 표시됩니다.</div>
				</div>
				<button className="btn-primary" onClick={openCreate}>
					<Plus className="w-4 h-4" /> 새 역할 추가
				</button>
			</div>

			{notice && (
				<div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
					<XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
					<div className="flex-1 text-[13px] font-semibold text-rose-800">{notice}</div>
					<button type="button" onClick={() => setNotice(null)} className="text-rose-400 hover:text-rose-600 text-[15px] leading-none">
						&times;
					</button>
				</div>
			)}

			{loading && (
				<div className="card" style={{ padding: "60px", alignItems: "center" }}>
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
				</div>
			)}

			{error && !loading && (
				<div className="card" style={{ padding: "20px", color: "#DC2626", fontWeight: 600 }}>{error}</div>
			)}

			{!loading && !error && (
				<div
					className="split"
					/* .split 기본값은 본문(1fr)+사이드(320px) 이므로, 목록-좌/상세-우 화면에 맞게 열 비율을 뒤집는다 */
					style={{ gridTemplateColumns: "340px minmax(0, 1fr)" }}
				>
					{/* 좌측: 역할 목록 */}
					<div className="card" style={{ minWidth: 0 }}>
						<div className="card-head">
							<div className="card-title">역할 목록</div>
							<span className="foot-info">{roles.length}개</span>
						</div>
						<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
							{roles.map((r) => {
								const isSelected = selectedId === r.id;
								return (
									<button
										key={r.id}
										type="button"
										onClick={() => setSelectedId(r.id)}
										aria-pressed={isSelected}
										className={`w-full text-left cursor-pointer rounded-xl border p-4 transition-colors ${
											isSelected ? "border-indigo-500 bg-indigo-50/60" : "border-slate-200 bg-white hover:bg-slate-50"
										}`}
									>
										<div className="flex items-start justify-between gap-2 mb-2">
											<div className={`p-2 rounded-lg bg-white border border-slate-100 ${getRoleTextColor(r.code)}`}>
												{getRoleIcon(r.code, "w-5 h-5")}
											</div>
											{isStagedRemove(r) ? (
												<span className="pill red">삭제 예정</span>
											) : (
												<span className={`pill ${shownActive(r) ? "blue" : "gray"}`}>
													{shownActive(r) ? "활성" : "비활성"}
													{pending[r.id] ? " 예정" : ""}
												</span>
											)}
										</div>
										<div className="font-extrabold text-slate-900 text-[15px]">{r.name}</div>
										<div className="text-[11.5px] font-mono text-slate-400 mb-1">{r.code}</div>
										<div className="text-[12.5px] text-slate-500 line-clamp-2">
											{r.description || "설명 없음"}
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* 우측: 상세 + 조작 */}
					<div className="card" style={{ minWidth: 0 }}>
						{selectedRole ? (
							<>
								<div className="card-head">
									<div className="flex items-center gap-2 min-w-0">
										<div className={getRoleTextColor(selectedRole.code)}>{getRoleIcon(selectedRole.code, "w-5 h-5")}</div>
										<div className="card-title truncate">{selectedRole.name}</div>
										<span className="pill gray font-mono">{selectedRole.code}</span>
										{isProtected(selectedRole.code) && <span className="pill amber">보호됨</span>}
									</div>
									<div className="head-actions" style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
										<button className="btn-ghost" onClick={() => openEdit(selectedRole)} disabled={isProtected(selectedRole.code)}
											style={isProtected(selectedRole.code) ? { opacity: 0.4, cursor: "not-allowed" } : undefined}>
											<Pencil className="w-3.5 h-3.5" /> 수정
										</button>
										<button className="btn-ghost" onClick={() => stageToggleActive(selectedRole)}
											disabled={isProtected(selectedRole.code) || isStagedRemove(selectedRole)}
											style={isProtected(selectedRole.code) || isStagedRemove(selectedRole) ? { opacity: 0.4, cursor: "not-allowed" } : undefined}>
											{shownActive(selectedRole) ? "비활성화" : "활성화"}
										</button>
										<button className="btn-ghost" onClick={() => setPendingDelete(selectedRole)}
											disabled={isProtected(selectedRole.code) || isStagedRemove(selectedRole)}
											style={isProtected(selectedRole.code) ? { opacity: 0.4, cursor: "not-allowed" } : { color: "#DC2626", borderColor: "#FECACA" }}>
											<Trash2 className="w-3.5 h-3.5" /> 삭제
										</button>
									</div>
								</div>

								<div className="flex-1 overflow-y-auto p-6">
									{isProtected(selectedRole.code) && (
										<div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] font-medium text-amber-800">
											최고 관리자 역할은 시스템 잠금이 걸려 있어 수정·비활성·삭제할 수 없습니다. (권한을 잃고 로그인하지 못하는 사고 방지)
										</div>
									)}

									<h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3">API 권한 (Permissions)</h3>
									<div className="flex flex-wrap gap-2 mb-8">
										{selectedRole.permissions.length === 0 ? (
											isProtected(selectedRole.code) ? (
												<span className="pill blue">모든 권한 (All Permissions)</span>
											) : (
												<span className="pill gray">부여된 권한 없음</span>
											)
										) : (
											selectedRole.permissions.map((p) => (
												<span key={p} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[12.5px] font-mono">
													{p}
												</span>
											))
										)}
									</div>

									<h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">접근 가능 모듈 (UI)</h3>
									<p className="text-[12px] text-slate-400 mb-3">위 권한에서 자동으로 계산됩니다. 권한을 바꾸면 이 목록도 함께 바뀝니다.</p>
									<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
										{FEATURES.map((feat) => {
											const granted = grantingPermissions(selectedRole, feat.perms);
											const ok = granted.length > 0;
											return (
												<div key={feat.id} className={`p-3 rounded-xl border flex items-center gap-3 ${ok ? "bg-emerald-50/60 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
													<div className={`p-2 rounded-lg ${ok ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>{feat.icon}</div>
													<div className="flex-1 min-w-0">
														<div className={`text-[13px] font-bold ${ok ? "text-emerald-900" : "text-slate-500"}`}>{feat.name}</div>
														<div className={`text-[10.5px] font-mono truncate ${ok ? "text-emerald-600" : "text-slate-400"}`}>
															{ok ? granted.join(", ") : `${feat.perms.join(" / ")} 필요`}
														</div>
													</div>
													{ok ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <XCircle className="w-5 h-5 text-slate-300 shrink-0" />}
												</div>
											);
										})}
									</div>
								</div>
							</>
						) : (
							<div className="flex-1 flex flex-col items-center justify-center text-center p-8">
								<Shield className="w-14 h-14 text-slate-200 mb-4" />
								<div className="text-[15px] font-bold text-slate-700">역할을 선택해주세요</div>
								<div className="text-[13px] text-slate-500 mt-1">좌측 목록에서 역할을 선택하면 상세 권한이 표시됩니다.</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* 변경 예약 바 — 비활성/삭제는 여기서 '적용'을 눌러야 서버에 반영된다 */}
			{pendingCount > 0 && (
				<div
					style={{
						position: "fixed", right: "32px", bottom: "24px", zIndex: 50,
						display: "flex", alignItems: "center", gap: "14px",
						background: "#fff", border: "1px solid #E5E8EE", borderRadius: "14px",
						padding: "12px 16px", boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
					}}
				>
					<span className="text-[13px] font-semibold text-slate-700">
						적용 대기 <span className="text-indigo-600 font-extrabold">{pendingCount}</span>건
					</span>
					<button type="button" className="btn-ghost" onClick={revertPending} disabled={applying}>
						되돌리기
					</button>
					<button type="button" className="btn-primary" onClick={applyPending} disabled={applying}>
						{applying ? "적용 중..." : "적용"}
					</button>
				</div>
			)}

			{/* 삭제 확인 */}
			{pendingDelete && (
				<div className="modal-overlay">
					<div className="modal" style={{ maxWidth: "420px" }}>
						<div className="modal-head">
							<div className="modal-title">역할 삭제</div>
							<button type="button" onClick={() => setPendingDelete(null)} className="modal-x">&times;</button>
						</div>
						<div className="modal-body">
							<p className="text-[13.5px] text-slate-700 leading-relaxed">
								<b>{pendingDelete.name}</b> (<span className="font-mono">{pendingDelete.code}</span>) 역할을 삭제 예정으로 표시합니다.
								<br />오른쪽 아래 <b>적용</b>을 눌러야 실제로 삭제되며, 사용 중인 교직원이 있으면 적용 시 거부됩니다.
							</p>
							<div className="modal-foot" style={{ marginTop: "20px" }}>
								<button type="button" onClick={() => setPendingDelete(null)} className="btn-ghost">취소</button>
								<button type="button" onClick={() => stageDelete(pendingDelete)} className="btn-primary" style={{ background: "#DC2626" }}>
									삭제 예정으로 표시
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* 생성/수정 모달 */}
			{form && (
				<div className="modal-overlay">
					<div className="modal">
						<div className="modal-head">
							<div className="modal-title">{form.id === null ? "새 역할 추가" : "역할 수정"}</div>
							<button type="button" onClick={() => setForm(null)} className="modal-x">&times;</button>
						</div>
						<div className="modal-body">
							<form onSubmit={submitForm}>
								<div className="form-grid">
									<div className="form-field">
										<label>역할 코드 <span className="req">*</span></label>
										<input
											value={form.code}
											onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
											placeholder="ROLE_MANAGER"
											disabled={form.id !== null}
											required
										/>
										<span className="text-[11.5px] text-slate-400 mt-1 block">
											{form.id !== null ? "코드는 생성 후 변경할 수 없습니다." : "ROLE_ 로 시작 · 영문 대문자/숫자/_"}
										</span>
									</div>
									<div className="form-field">
										<label>역할 이름 <span className="req">*</span></label>
										<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예: 팀장" required />
									</div>
									<div className="form-field full">
										<label>설명</label>
										<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="이 역할이 하는 일" />
									</div>
									<div className="form-field full">
										<label>부여할 권한 ({form.permissionCodes.length}/{permissions.length})</label>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
											{permissions.map((p) => {
												const checked = form.permissionCodes.includes(p.code);
												return (
													<label key={p.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${checked ? "border-indigo-400 bg-indigo-50/60" : "border-slate-200 hover:bg-slate-50"}`}>
														<input type="checkbox" checked={checked} onChange={() => togglePermission(p.code)} />
														<span className="flex-1 min-w-0">
															<span className="block text-[13px] font-bold text-slate-800">{p.name}</span>
															<span className="block text-[11px] font-mono text-slate-400 truncate">{p.code}</span>
														</span>
													</label>
												);
											})}
										</div>
									</div>
								</div>
								<div className="modal-foot" style={{ marginTop: "20px" }}>
									<button type="button" onClick={() => setForm(null)} className="btn-ghost">취소</button>
									<button type="submit" disabled={saving} className="btn-primary">
										{saving ? "저장 중..." : form.id === null ? "역할 추가" : "변경 저장"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
