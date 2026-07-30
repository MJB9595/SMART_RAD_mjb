import { Check, Clock, CalendarCheck, FileText, Download } from "lucide-react";
import type { ReactNode } from "react";
import { FadeInSection } from "./FadeInSection";

interface FeatureDetailProps {
	badgeText: string;
	badgeIcon?: ReactNode;
	title: string;
	description?: string;
	features: string[];
	reverse?: boolean;
	mockupType: 'attendance' | 'salary' | 'hr';
	mockupStyle?: 'window' | 'floating';
}

export function FeatureDetailSection({ badgeText, badgeIcon, title, description, features, reverse = false, mockupType, mockupStyle = 'window' }: FeatureDetailProps) {
	return (
		<section className={`relative min-h-screen flex flex-col justify-center py-24 lg:py-32 overflow-hidden ${reverse ? 'bg-slate-50' : 'bg-white'}`}>
			{/* Removed the messy blur gradients and replaced with a clean crisp subtle pattern if needed, or just clean background */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

			<div className="relative mx-auto w-full px-8 md:px-16 lg:px-24 z-10">
				<div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reverse ? 'lg:[&>div:first-child]:order-last' : ''}`}>
					
					{/* Text Content */}
					<div className={`max-w-2xl w-full mx-auto text-center lg:text-left flex flex-col items-center lg:items-start ${reverse ? 'lg:mr-auto' : 'lg:ml-auto'}`}>
						<div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white shadow-sm px-4 py-1.5 text-sm font-bold text-slate-700 mb-8">
							{badgeIcon && <span className="text-blue-600">{badgeIcon}</span>}
							{!badgeIcon && badgeText}
							{badgeIcon && badgeText}
						</div>
						<h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-8 whitespace-pre-line leading-tight">
							{title}
						</h2>
						{description && (
							<p className="text-lg lg:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
								{description}
							</p>
						)}
						<ul className="space-y-6">
							{features.map((feature, idx) => (
								<li key={idx} className="flex items-start gap-4">
									<div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
										<Check className="h-4 w-4 text-blue-600" strokeWidth={3} />
									</div>
									<span className="text-lg lg:text-xl text-slate-700 font-bold">{feature}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Mockup Content */}
					<FadeInSection direction={reverse ? "left" : "right"}>
						<div className={`relative w-full max-w-xl mx-auto lg:max-w-[700px] mt-16 lg:mt-0 ${reverse ? 'lg:mx-0 lg:ml-auto' : 'lg:mx-0 lg:mr-auto'}`}>
							{mockupStyle === 'floating' ? (
								<div className="w-full flex items-center justify-center relative">
									{mockupType === 'attendance' && <AttendanceMockup />}
									{mockupType === 'salary' && <SalaryMockup />}
									{mockupType === 'hr' && <HRMockup />}
								</div>
							) : (
								<div className="mockup-window !rounded-2xl !shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-slate-200 !bg-white">
									{/* Browser window controls */}
									<div className="flex items-center px-4 py-3 border-b border-slate-100 bg-slate-50/50">
										<div className="flex gap-2">
											<div className="h-3 w-3 rounded-full bg-slate-300" />
											<div className="h-3 w-3 rounded-full bg-slate-300" />
											<div className="h-3 w-3 rounded-full bg-slate-300" />
										</div>
									</div>
									
									<div className="flex-1 overflow-hidden bg-slate-50/30 pb-0 flex items-end justify-center">
										{mockupType === 'attendance' && <AttendanceMockup />}
										{mockupType === 'salary' && <SalaryMockup />}
										{mockupType === 'hr' && <HRMockup />}
									</div>
								</div>
							)}
						</div>
					</FadeInSection>

				</div>
			</div>
		</section>
	);
}

function AttendanceMockup() {
	return (
		<div className="relative w-full h-[400px] max-w-[560px] pt-8">
			{/* Clean realistic layout for Attendance */}
			<div className="absolute left-4 bottom-0 w-full max-w-[400px] bg-white rounded-t-2xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-slate-200 border-b-0 p-6 flex flex-col gap-4 z-10 h-[300px]">
				<div className="font-bold text-slate-900 text-base mb-2 border-b border-slate-100 pb-3">주간 근태 현황</div>
				{[
					{ name: '김성민', role: '3학년 담임', status: '출근', color: 'bg-emerald-50 text-emerald-600' },
					{ name: '이수진', role: '수학과 교사', status: '출근', color: 'bg-emerald-50 text-emerald-600' },
					{ name: '박지훈', role: '교무행정사', status: '연차', color: 'bg-slate-100 text-slate-600' },
				].map((user, idx) => (
					<div key={idx} className="flex items-center justify-between py-2">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-bold">
								{user.name.charAt(0)}
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-bold text-slate-900">{user.name}</span>
								<span className="text-xs text-slate-500 font-medium">{user.role}</span>
							</div>
						</div>
						<div className={`px-3 py-1 rounded-md text-xs font-bold ${user.color}`}>
							{user.status}
						</div>
					</div>
				))}
			</div>

			<div className="absolute right-4 top-10 w-full max-w-[340px] bg-white rounded-2xl shadow-[0_20px_50px_rgb(0,0,0,0.12)] border border-slate-200 p-6 flex flex-col gap-5 z-20">
				<div className="flex items-center justify-between mb-2">
					<div className="font-bold text-slate-900 text-sm">연가 신청 승인 대기</div>
					<div className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">3건</div>
				</div>
				<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
					<div className="flex justify-between items-start mb-3">
						<div>
							<div className="text-sm font-bold text-slate-900">정하은 교사</div>
							<div className="text-xs text-slate-500 mt-0.5">병가 신청 (1일)</div>
						</div>
					</div>
					<div className="flex gap-2 mt-4">
						<div className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg text-center cursor-pointer">반려</div>
						<div className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg text-center cursor-pointer shadow-sm">승인하기</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function SalaryMockup() {
	return (
		<div className="w-full max-w-[560px] bg-white rounded-t-2xl shadow-[0_-10px_40px_rgb(0,0,0,0.06)] border border-slate-200 border-b-0 flex flex-col overflow-hidden mt-10">
			<div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
				<div>
					<div className="text-xs font-bold text-blue-600 mb-1">2026년 6월</div>
					<div className="font-bold text-slate-900 text-lg">급여 정산 대장</div>
				</div>
				<div className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
					<Download className="w-3 h-3" /> 엑셀 다운로드
				</div>
			</div>
			
			<div className="flex flex-col p-6 gap-4 bg-white">
				<div className="flex justify-between items-center p-4 rounded-xl border border-slate-100 bg-slate-50">
					<span className="text-slate-600 font-semibold text-sm">기본급 총액</span>
					<span className="font-bold text-slate-900 text-base">142,500,000 원</span>
				</div>
				<div className="flex justify-between items-center p-4 rounded-xl border border-slate-100 bg-slate-50">
					<span className="text-slate-600 font-semibold text-sm">초과근무 수당</span>
					<span className="font-bold text-slate-900 text-base">12,450,000 원</span>
				</div>
				<div className="flex justify-between items-center p-4 rounded-xl border border-slate-100 bg-slate-50">
					<span className="text-slate-600 font-semibold text-sm">4대 보험 및 공제</span>
					<span className="font-bold text-rose-600 text-base">- 28,140,000 원</span>
				</div>
				<div className="flex justify-between items-center p-5 rounded-xl bg-blue-50 border border-blue-100 mt-2">
					<span className="font-bold text-blue-800">실지급 총액</span>
					<span className="font-extrabold text-blue-700 text-xl">126,810,000 원</span>
				</div>
			</div>
		</div>
	);
}

function HRMockup() {
	return (
		<div className="relative w-full max-w-[600px] h-[400px] flex items-center justify-center p-6">
			{/* Timeline style mockup instead of generic tree */}
			<div className="w-full h-full bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-slate-200 p-8 flex flex-col">
				<div className="font-bold text-slate-900 text-lg mb-6 border-b border-slate-100 pb-4">인사발령 타임라인</div>
				
				<div className="relative flex-1">
					<div className="absolute left-[19px] top-2 bottom-0 w-0.5 bg-slate-100"></div>
					
					<div className="flex gap-6 relative mb-8">
						<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-sm z-10 shrink-0">
							<div className="w-3 h-3 bg-blue-600 rounded-full"></div>
						</div>
						<div>
							<div className="text-xs font-bold text-slate-400 mb-1">2026. 03. 01</div>
							<div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
								<div className="font-bold text-slate-900 text-sm mb-1">김성민 교사 정규 승진</div>
								<div className="text-xs text-slate-500 font-medium">2학년 담임 ➔ 3학년 담임 (승진 발령)</div>
							</div>
						</div>
					</div>
					
					<div className="flex gap-6 relative">
						<div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-sm z-10 shrink-0">
							<div className="w-2 h-2 bg-slate-400 rounded-full"></div>
						</div>
						<div>
							<div className="text-xs font-bold text-slate-400 mb-1">2025. 09. 01</div>
							<div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
								<div className="font-bold text-slate-900 text-sm mb-1">신규 채용 발령</div>
								<div className="text-xs text-slate-500 font-medium">박지훈 교무행정사 신규 부임</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
