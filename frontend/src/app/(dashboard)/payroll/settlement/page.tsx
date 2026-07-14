"use client";

import { useState } from "react";
import { Field, Select, Button } from "@/components/ui";

export default function SettlementPage() {
	const [year, setYear] = useState("2026");
	const [month, setMonth] = useState("07");

	return (
		<div>
			<nav className="mb-2 text-sm text-slate-500">
				급여 관리 <span className="mx-1">›</span>{" "}
				<span className="font-medium text-slate-900">정산 엑셀 다운로드</span>
			</nav>
			<div className="mb-6 flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">정산용 엑셀 다운로드</h1>
					<p className="mt-1 text-sm text-slate-500">은행 전송 및 회계 처리용 급여 대장을 엑셀로 다운로드합니다.</p>
				</div>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white p-8 max-w-2xl">
				<div className="flex flex-col gap-6">
					<div className="flex gap-4">
						<Field label="정산 연도">
							<Select value={year} onChange={(e) => setYear(e.target.value)}>
								<option value="2026">2026년</option>
								<option value="2025">2025년</option>
							</Select>
						</Field>
						<Field label="정산 월">
							<Select value={month} onChange={(e) => setMonth(e.target.value)}>
								{Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(m => (
									<option key={m} value={m}>{m}월</option>
								))}
							</Select>
						</Field>
						<Field label="양식 유형">
							<Select>
								<option value="bank">은행 전송용 (계좌번호 포함)</option>
								<option value="acc">회계 처리용 (계정과목 포함)</option>
								<option value="full">전체 급여대장</option>
							</Select>
						</Field>
					</div>
					
					<div className="bg-slate-50 p-4 rounded-md border border-slate-100 text-sm text-slate-600">
						<ul className="list-disc list-inside space-y-1">
							<li>확정 처리된 급여 데이터만 엑셀에 포함됩니다.</li>
							<li>은행 전송용 양식은 주민번호 대신 사번이 마스킹되어 포함됩니다.</li>
						</ul>
					</div>

					<div>
						<Button className="w-full justify-center">엑셀 파일 생성 및 다운로드</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
