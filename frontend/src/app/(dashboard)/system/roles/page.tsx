"use client";

import { useEffect, useState } from "react";
import { listRoles } from "@/lib/api/system";
import { ApiError } from "@/lib/api/client";
import type { RoleInfo } from "@/lib/types/system";
import { Shield, ShieldCheck, Users, User, CheckCircle2, XCircle, Key, Activity, Wallet, FileText, Settings, Clock } from "lucide-react";

const getRoleIcon = (code: string) => {
	switch (code) {
		case "ROLE_ADMIN":
			return <Shield className="w-6 h-6 text-indigo-600" />;
		case "ROLE_HR":
			return <Users className="w-6 h-6 text-emerald-600" />;
		case "ROLE_USER":
			return <User className="w-6 h-6 text-blue-600" />;
		default:
			return <ShieldCheck className="w-6 h-6 text-slate-600" />;
	}
};

const getRoleColor = (code: string) => {
	switch (code) {
		case "ROLE_ADMIN":
			return "bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:shadow-indigo-100";
		case "ROLE_HR":
			return "bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100";
		case "ROLE_USER":
			return "bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-blue-100";
		default:
			return "bg-slate-50 border-slate-200 hover:border-slate-400 hover:shadow-slate-100";
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

const FEATURES = [
	{ id: "employees", name: "인사기록 관리", icon: <User className="w-4 h-4" /> },
	{ id: "appointments", name: "인사발령 관리", icon: <FileText className="w-4 h-4" /> },
	{ id: "attendance", name: "근태·휴가 관리", icon: <Clock className="w-4 h-4" /> },
	{ id: "payroll", name: "급여/수당 관리", icon: <Wallet className="w-4 h-4" /> },
	{ id: "welfare", name: "복지·증명 관리", icon: <Activity className="w-4 h-4" /> },
	{ id: "system", name: "시스템 권한 관리", icon: <Settings className="w-4 h-4" /> },
];

// Helper to determine if a role has access to a feature based on UI logic
const hasFeatureAccess = (roleCode: string, featureId: string) => {
	if (roleCode === "ROLE_ADMIN") return true;
	if (roleCode === "ROLE_HR") {
		return ["employees", "appointments", "attendance", "payroll", "welfare"].includes(featureId);
	}
	if (roleCode === "ROLE_USER") {
		return ["attendance", "payroll", "welfare"].includes(featureId);
	}
	return false;
};

export default function RolesPage() {
	const [roles, setRoles] = useState<RoleInfo[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedRole, setSelectedRole] = useState<RoleInfo | null>(null);

	useEffect(() => {
		listRoles()
			.then((data) => {
				setRoles(data);
				if (data.length > 0) setSelectedRole(data[0]);
			})
			.catch((err) => setError(err instanceof ApiError ? err.message : "권한 정보를 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="flex flex-col h-full bg-slate-50/50 p-6">
			<div className="mb-8">
				<h1 className="text-[26px] font-black text-slate-900 tracking-tight flex items-center gap-2">
					<Key className="w-7 h-7 text-indigo-600" />
					권한 관리 (RBAC)
				</h1>
				<p className="mt-2 text-sm font-medium text-slate-500">
					시스템 내 역할별 권한 구성을 조회하고 모니터링합니다. 역할 카드를 클릭하여 상세 접근 권한을 확인하세요.
				</p>
			</div>

			{loading && (
				<div className="flex flex-1 justify-center items-center">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
				</div>
			)}
			
			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
					{error}
				</div>
			)}

			{!loading && !error && (
				<div className="flex flex-1 gap-6 min-h-0">
					{/* Left Column: Role Cards */}
					<div className="w-[320px] flex flex-col gap-4 overflow-y-auto pr-2 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
						{roles.map((r) => {
							const isSelected = selectedRole?.id === r.id;
							return (
								<button
									key={r.id}
									onClick={() => setSelectedRole(r)}
									className={`w-full text-left relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 ease-out shadow-sm
										${getRoleColor(r.code)} 
										${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.02]' : 'hover:-translate-y-1'}
									`}
								>
									<div className="flex justify-between items-start mb-3">
										<div className={`p-2.5 rounded-xl bg-white shadow-sm ${getRoleTextColor(r.code)}`}>
											{getRoleIcon(r.code)}
										</div>
										<span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${r.active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
											{r.active ? "활성" : "비활성"}
										</span>
									</div>
									<div className="font-extrabold text-slate-900 text-lg tracking-tight mb-1">{r.name}</div>
									<div className="text-xs font-mono font-semibold text-slate-400 mb-3">{r.code}</div>
									<div className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-2">
										{r.description || "설명이 등록되지 않았습니다."}
									</div>
								</button>
							);
						})}
					</div>

					{/* Right Column: Detailed Permission Matrix */}
					<div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative animate-in fade-in duration-300">
						{selectedRole ? (
							<>
								<div className={`h-32 bg-gradient-to-br from-slate-100 to-white border-b border-slate-100 p-8 flex items-end relative overflow-hidden`}>
									<div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150">
										{getRoleIcon(selectedRole.code)}
									</div>
									<div>
										<h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
											{selectedRole.name} 상세 권한
											<span className="px-2.5 py-1 bg-slate-800 text-white text-[11px] font-bold rounded-md tracking-wider">
												{selectedRole.code}
											</span>
										</h2>
									</div>
								</div>

								<div className="p-8 flex-1 overflow-y-auto">
									<div className="mb-8">
										<h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">API 권한 (Permissions)</h3>
										<div className="flex flex-wrap gap-2">
											{selectedRole.permissions.length === 0 ? (
												<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold">
													<CheckCircle2 className="w-4 h-4" />
													모든 권한(All Permissions)
												</span>
											) : (
												selectedRole.permissions.map(p => (
													<span key={p} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium font-mono">
														{p}
													</span>
												))
											)}
										</div>
									</div>

									<div>
										<h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">접근 가능 모듈 (UI Features)</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{FEATURES.map(feat => {
												const hasAccess = hasFeatureAccess(selectedRole.code, feat.id);
												return (
													<div 
														key={feat.id} 
														className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
															hasAccess 
															? 'bg-emerald-50/50 border-emerald-200' 
															: 'bg-slate-50 border-slate-200 opacity-70'
														}`}
													>
														<div className={`p-2 rounded-lg ${hasAccess ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
															{feat.icon}
														</div>
														<div className="flex-1">
															<div className={`text-sm font-bold ${hasAccess ? 'text-emerald-900' : 'text-slate-600'}`}>
																{feat.name}
															</div>
														</div>
														<div>
															{hasAccess ? (
																<CheckCircle2 className="w-5 h-5 text-emerald-500" />
															) : (
																<XCircle className="w-5 h-5 text-slate-300" />
															)}
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</>
						) : (
							<div className="flex-1 flex flex-col items-center justify-center text-center p-8">
								<Shield className="w-16 h-16 text-slate-200 mb-4" />
								<h3 className="text-lg font-bold text-slate-700">역할을 선택해주세요</h3>
								<p className="text-slate-500 mt-2">좌측 목록에서 역할을 선택하시면 상세 권한을 볼 수 있습니다.</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
