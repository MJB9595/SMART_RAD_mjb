"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function SettlementPage() {
	const [year, setYear] = useState("2026");
	const [month, setMonth] = useState("07");
	const [formType, setFormType] = useState("bank");

	return (
		<div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl shadow-sm border border-blue-100/50 gap-4">
				<div>
					<nav className="mb-2 text-xs font-semibold text-blue-600 tracking-wider uppercase">
						Salary Management <span className="mx-2 text-blue-300">/</span> Settlement
					</nav>
					<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">정산용 엑셀 다운로드</h1>
					<p className="mt-2 text-sm text-slate-600 font-medium">은행 이체 및 회계 부서 전달용 급여 정산 데이터를 엑셀로 추출합니다.</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8 relative">
				<div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
				
				<h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
					<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					다운로드 옵션 설정
				</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div className="space-y-2">
						<label className="block text-sm font-semibold text-slate-700">정산 연도</label>
						<select 
							value={year} 
							onChange={(e) => setYear(e.target.value)}
							className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
						>
							<option value="2026">2026년 (당해년도)</option>
							<option value="2025">2025년</option>
						</select>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-semibold text-slate-700">정산 월</label>
						<select 
							value={month} 
							onChange={(e) => setMonth(e.target.value)}
							className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
						>
							{Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(m => (
								<option key={m} value={m}>{m}월 정산분</option>
							))}
						</select>
					</div>
				</div>

				<div className="space-y-2 mb-8">
					<label className="block text-sm font-semibold text-slate-700">추출 양식 유형</label>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${formType === 'bank' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
							<input type="radio" name="formType" value="bank" checked={formType === 'bank'} onChange={(e) => setFormType(e.target.value)} className="absolute opacity-0" />
							<div className="flex justify-between items-start mb-2">
								<span className="font-bold text-slate-800">은행 전송용</span>
								{formType === 'bank' && <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>}
							</div>
							<span className="text-xs font-medium text-slate-500">계좌번호 필수, 주민번호 사번으로 마스킹 대체</span>
						</label>
						
						<label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${formType === 'acc' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
							<input type="radio" name="formType" value="acc" checked={formType === 'acc'} onChange={(e) => setFormType(e.target.value)} className="absolute opacity-0" />
							<div className="flex justify-between items-start mb-2">
								<span className="font-bold text-slate-800">회계 처리용</span>
								{formType === 'acc' && <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>}
							</div>
							<span className="text-xs font-medium text-slate-500">계정과목 매핑 코드 포함, 세무 신고 참고용</span>
						</label>
						
						<label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${formType === 'full' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}>
							<input type="radio" name="formType" value="full" checked={formType === 'full'} onChange={(e) => setFormType(e.target.value)} className="absolute opacity-0" />
							<div className="flex justify-between items-start mb-2">
								<span className="font-bold text-slate-800">전체 급여대장</span>
								{formType === 'full' && <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>}
							</div>
							<span className="text-xs font-medium text-slate-500">마스킹 없는 원본 데이터 전체 (보안 주의)</span>
						</label>
					</div>
				</div>
				
				<div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3 mb-8">
					<svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div className="text-sm font-medium text-amber-800">
						<p className="mb-1"><strong>안내사항</strong></p>
						<ul className="list-disc list-inside space-y-1 text-amber-700/80 text-xs">
							<li><span className="font-semibold text-amber-800">확정 처리된 급여 데이터만 엑셀에 포함</span>됩니다.</li>
							<li>다운로드된 엑셀 파일에는 민감한 개인정보가 포함되어 있으므로 보관 및 취급에 각별히 유의해 주시기 바랍니다.</li>
						</ul>
					</div>
				</div>

				<div className="flex justify-end pt-4 border-t border-slate-100">
					<button className="w-full md:w-auto px-8 py-3 h-auto bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all text-base flex items-center justify-center gap-2">
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						엑셀 파일 생성 및 다운로드
					</button>
				</div>
			</div>
		</div>
	);
}
