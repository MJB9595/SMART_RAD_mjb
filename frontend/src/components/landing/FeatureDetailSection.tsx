import { Check, Clock, CalendarCheck, FileText, Download } from "lucide-react";
import type { ReactNode } from "react";

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
		<section className={`py-24 ${reverse ? 'bg-slate-50' : 'bg-white'}`}>
			<div className="mx-auto max-w-[1600px] px-8 md:px-16 lg:px-24">
				<div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reverse ? 'lg:[&>div:first-child]:order-last' : ''}`}>
					
					{/* Text Content */}
					<div className={`max-w-xl w-full ${reverse ? 'lg:mr-auto' : 'lg:ml-auto'}`}>
						<div className="badge-primary mb-6">
							{badgeIcon}
							{badgeText}
						</div>
						<h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6 whitespace-pre-line">
							{title}
						</h2>
						{description && (
							<p className="text-lg text-slate-600 mb-8">
								{description}
							</p>
						)}
						<ul className="space-y-4">
							{features.map((feature, idx) => (
								<li key={idx} className="flex items-start gap-3">
									<div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
										<Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
									</div>
									<span className="text-slate-700 font-medium">{feature}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Mockup Content */}
					<div className={`relative w-full max-w-lg lg:max-w-[640px] ${reverse ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
						{mockupStyle === 'floating' ? (
							<div className="w-full flex items-center justify-center relative">
								{mockupType === 'attendance' && <AttendanceMockup />}
								{mockupType === 'salary' && <SalaryMockup />}
								{mockupType === 'hr' && <HRMockup />}
							</div>
						) : (
							<div className="mockup-window !rounded-3xl !shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-slate-100 !bg-[#F8FAFC]">
								{/* Mac OS window controls */}
								<div className="flex items-center px-6 py-5">
									<div className="flex gap-2.5">
										<div className="h-3 w-3 rounded-full bg-slate-200" />
										<div className="h-3 w-3 rounded-full bg-slate-200" />
										<div className="h-3 w-3 rounded-full bg-slate-200" />
									</div>
								</div>
								
								<div className="flex-1 px-8 pb-10 sm:px-12 sm:pb-12 overflow-hidden flex flex-col">
									{mockupType === 'attendance' && <AttendanceMockup />}
									{mockupType === 'salary' && <SalaryMockup />}
									{mockupType === 'hr' && <HRMockup />}
								</div>
							</div>
						)}
					</div>

				</div>
			</div>
		</section>
	);
}

function AttendanceMockup() {
	return (
		<div className="relative w-full h-[480px] max-w-[640px]">
			{/* Back Card (Bottom Left) */}
			<div className="absolute left-0 bottom-12 w-full max-w-[460px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-6 flex flex-col gap-4 z-10">
				<div className="font-bold text-slate-900 text-sm mb-2">출퇴근 현황</div>
				{[
					{ initial: '김', name: '김성민 · 3학년 담임', time: '38.5h / 40h' },
					{ initial: '이', name: '이수진 · 수학과 교사', time: '39.5h / 40h' },
					{ initial: '박', name: '박지훈 · 교무행정사', time: '35.0h / 40h' },
					{ initial: '최', name: '최다연 · 영어과 교사', time: '40.0h / 40h' },
				].map((user, idx) => (
					<div key={idx} className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-medium shrink-0">
							{user.initial}
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-semibold text-slate-900">{user.name}</span>
							<span className="text-[11px] text-slate-400">이번 주 복무 시간: {user.time}</span>
						</div>
					</div>
				))}
			</div>

			{/* Front Card (Top Right) */}
			<div className="absolute right-0 top-8 w-full max-w-[460px] bg-white rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.12)] border border-slate-100 p-6 flex flex-col gap-5 z-20">
				<div className="flex items-center justify-between mb-2">
					<div className="font-bold text-slate-900 text-sm">휴가 신청 내역</div>
					<div className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">승인 대기 4</div>
				</div>
				{[
					{ initial: '정', name: '정하은 · 연가', date: '07/14 - 07/15 · 2일', status: '대기', statusColor: 'bg-amber-50 text-amber-600' },
					{ initial: '오', name: '오준혁 · 병가', date: '07/10 · 1일', status: '승인', statusColor: 'bg-emerald-50 text-emerald-600' },
					{ initial: '윤', name: '윤서아 · 공가(연수)', date: '07/18 - 07/19 · 2일', status: '대기', statusColor: 'bg-amber-50 text-amber-600' },
					{ initial: '한', name: '한지수 · 특별휴가', date: '07/07 - 07/08 · 2일', status: '완료', statusColor: 'bg-blue-50 text-blue-600' },
				].map((item, idx) => (
					<div key={idx} className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-medium shrink-0">
								{item.initial}
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-semibold text-slate-900">{item.name}</span>
								<span className="text-[11px] text-slate-400">{item.date}</span>
							</div>
						</div>
						<div className={`rounded-full px-3 py-1 text-[11px] font-bold shrink-0 ${item.statusColor}`}>
							{item.status}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function SalaryMockup() {
	return (
		<div className="w-full max-w-[640px] bg-white rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col overflow-hidden">
			{/* Header */}
			<div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
				<div className="font-bold text-slate-900 text-lg">급여 명세 · 2026년 6월</div>
				<div className="bg-blue-50 text-blue-600 font-bold text-sm px-5 py-2 rounded-full">
					확정
				</div>
			</div>
			
			{/* Table Header */}
			<div className="flex justify-between items-center px-8 py-3 bg-slate-50 border-b border-slate-100">
				<div className="text-sm font-semibold text-slate-500">항목</div>
				<div className="text-sm font-semibold text-slate-500">금액 (원)</div>
			</div>
			
			{/* Rows */}
			<div className="flex flex-col">
				<div className="flex justify-between px-8 py-5 border-b border-slate-100">
					<span className="text-slate-600 font-medium">기본급</span>
					<span className="font-bold text-slate-900">3,850,000</span>
				</div>
				<div className="flex justify-between px-8 py-5 border-b border-slate-100">
					<span className="text-slate-600 font-medium">정근수당</span>
					<span className="font-bold text-slate-900">192,500</span>
				</div>
				<div className="flex justify-between px-8 py-5 border-b border-slate-100">
					<span className="text-slate-600 font-medium">4대 보험 공제</span>
					<span className="font-bold text-slate-900">-356,200</span>
				</div>
				<div className="flex justify-between px-8 py-5 border-b border-slate-100">
					<span className="text-slate-600 font-medium">소득세 공제</span>
					<span className="font-bold text-slate-900">-148,300</span>
				</div>
				{/* Footer Row */}
				<div className="flex justify-between px-8 py-6 bg-blue-50/50">
					<span className="font-bold text-blue-600">실지급액</span>
					<span className="font-bold text-blue-600">3,538,000</span>
				</div>
			</div>
		</div>
	);
}

function HRMockup() {
	return (
		<div className="w-full max-w-[640px] bg-white rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col overflow-hidden">
			{/* Header */}
			<div className="flex justify-between items-center px-8 py-5 border-b border-slate-100">
				<div className="font-bold text-slate-900 text-lg">학교 조직도</div>
				<div className="bg-blue-50 text-blue-600 font-bold text-sm px-4 py-2 rounded-full">
					교직원 142명
				</div>
			</div>
			
			{/* Chart Content */}
			<div className="py-16 flex flex-col items-center bg-slate-50/30">
				{/* Level 1 */}
				<div className="bg-blue-600 text-white font-bold px-10 py-4 rounded-2xl shadow-sm text-lg z-10 min-w-[120px] text-center">
					교장
				</div>
				
				<div className="w-px h-6 bg-slate-200"></div>
				
				{/* Level 2 */}
				<div className="flex gap-4 z-10">
					<div className="bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 text-base min-w-[120px] text-center">
						교감
					</div>
					<div className="bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 text-base min-w-[120px] text-center">
						행정실장
					</div>
				</div>
				
				<div className="w-px h-6 bg-slate-200"></div>
				
				{/* Level 3 */}
				<div className="flex gap-4 z-10">
					<div className="bg-white text-slate-900 font-bold px-6 py-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 text-sm min-w-[100px] text-center">
						교무부
					</div>
					<div className="bg-white text-slate-900 font-bold px-6 py-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 text-sm min-w-[100px] text-center">
						연구부
					</div>
					<div className="bg-white text-slate-900 font-bold px-6 py-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 text-sm min-w-[100px] text-center">
						생활지도부
					</div>
					<div className="bg-white text-slate-900 font-bold px-6 py-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 text-sm min-w-[100px] text-center">
						행정팀
					</div>
				</div>
			</div>
		</div>
	);
}
