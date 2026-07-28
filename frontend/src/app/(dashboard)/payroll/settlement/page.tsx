"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function SettlementPage() {
	const [year, setYear] = useState("2026");
	const [month, setMonth] = useState("07");
	const [formType, setFormType] = useState("bank");

	return (
		<>
			<div className="title-row">
				<div>
					<div className="page-title">정산용 엑셀 다운로드</div>
					<div className="page-sub">은행 이체 및 회계 부서 전달용 급여 정산 데이터를 엑셀로 추출합니다</div>
				</div>
			</div>

			<div className="card">
				<div className="card-head">
					<div className="card-title" style={{display: "flex", alignItems: "center", gap: "8px"}}>
						<svg style={{width: "18px", height: "18px", color: "#1F3A8F"}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						다운로드 옵션 설정
					</div>
				</div>
				
				<div style={{padding: "24px 26px"}}>
					<div className="form-grid" style={{marginBottom: "24px"}}>
						<div className="form-field">
							<label>정산 연도</label>
							<select value={year} onChange={(e) => setYear(e.target.value)}>
								<option value="2026">2026년 (당해년도)</option>
								<option value="2025">2025년</option>
							</select>
						</div>
						<div className="form-field">
							<label>정산 월</label>
							<select value={month} onChange={(e) => setMonth(e.target.value)}>
								{Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(m => (
									<option key={m} value={m}>{m}월 정산분</option>
								))}
							</select>
						</div>
					</div>

					<div className="form-field full" style={{marginBottom: "32px"}}>
						<label>추출 양식 유형</label>
						<div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "8px"}}>
							<label style={{position: "relative", display: "flex", flexDirection: "column", padding: "16px", border: formType === 'bank' ? "2px solid #1F3A8F" : "1px solid #EEF0F3", borderRadius: "12px", cursor: "pointer", background: formType === 'bank' ? "#EAF0FF" : "#fff", transition: "all 0.2s"}}>
								<input type="radio" name="formType" value="bank" checked={formType === 'bank'} onChange={(e) => setFormType(e.target.value)} style={{position: "absolute", opacity: 0}} />
								<div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
									<span style={{fontWeight: 700, color: "#111827", fontSize: "14px"}}>은행 전송용</span>
									{formType === 'bank' && <span style={{width: "16px", height: "16px", borderRadius: "50%", background: "#1F3A8F", display: "flex", alignItems: "center", justifyContent: "center"}}><svg style={{width: "10px", height: "10px", color: "#fff"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>}
								</div>
								<span style={{fontSize: "12px", color: "#8A94A6", lineHeight: 1.4}}>계좌번호 필수, 주민번호 사번으로 마스킹 대체</span>
							</label>
							
							<label style={{position: "relative", display: "flex", flexDirection: "column", padding: "16px", border: formType === 'acc' ? "2px solid #1F3A8F" : "1px solid #EEF0F3", borderRadius: "12px", cursor: "pointer", background: formType === 'acc' ? "#EAF0FF" : "#fff", transition: "all 0.2s"}}>
								<input type="radio" name="formType" value="acc" checked={formType === 'acc'} onChange={(e) => setFormType(e.target.value)} style={{position: "absolute", opacity: 0}} />
								<div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
									<span style={{fontWeight: 700, color: "#111827", fontSize: "14px"}}>회계 처리용</span>
									{formType === 'acc' && <span style={{width: "16px", height: "16px", borderRadius: "50%", background: "#1F3A8F", display: "flex", alignItems: "center", justifyContent: "center"}}><svg style={{width: "10px", height: "10px", color: "#fff"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>}
								</div>
								<span style={{fontSize: "12px", color: "#8A94A6", lineHeight: 1.4}}>계정과목 매핑 코드 포함, 세무 신고 참고용</span>
							</label>
							
							<label style={{position: "relative", display: "flex", flexDirection: "column", padding: "16px", border: formType === 'full' ? "2px solid #1F3A8F" : "1px solid #EEF0F3", borderRadius: "12px", cursor: "pointer", background: formType === 'full' ? "#EAF0FF" : "#fff", transition: "all 0.2s"}}>
								<input type="radio" name="formType" value="full" checked={formType === 'full'} onChange={(e) => setFormType(e.target.value)} style={{position: "absolute", opacity: 0}} />
								<div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px"}}>
									<span style={{fontWeight: 700, color: "#111827", fontSize: "14px"}}>전체 급여대장</span>
									{formType === 'full' && <span style={{width: "16px", height: "16px", borderRadius: "50%", background: "#1F3A8F", display: "flex", alignItems: "center", justifyContent: "center"}}><svg style={{width: "10px", height: "10px", color: "#fff"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>}
								</div>
								<span style={{fontSize: "12px", color: "#8A94A6", lineHeight: 1.4}}>마스킹 없는 원본 데이터 전체 (보안 주의)</span>
							</label>
						</div>
					</div>
					
					<div style={{background: "#FEF3C7", padding: "14px 16px", borderRadius: "10px", display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "24px"}}>
						<svg style={{width: "18px", height: "18px", color: "#D97706", flexShrink: 0, marginTop: "2px"}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<div style={{fontSize: "12.5px", color: "#92400E", lineHeight: 1.5}}>
							<p style={{marginBottom: "2px", fontWeight: 700}}>안내사항</p>
							<ul style={{margin: 0, paddingLeft: "16px", listStyleType: "disc"}}>
								<li>확정 처리된 급여 데이터만 엑셀에 포함됩니다.</li>
								<li>다운로드된 엑셀 파일에는 민감한 개인정보가 포함되어 있으므로 보관 및 취급에 유의해 주시기 바랍니다.</li>
							</ul>
						</div>
					</div>

					<div style={{display: "flex", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid #F1F3F6"}}>
						<button className="btn-primary" style={{padding: "10px 20px"}}>
							<svg style={{width: "16px", height: "16px", marginRight: "4px"}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							엑셀 파일 생성 및 다운로드
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
