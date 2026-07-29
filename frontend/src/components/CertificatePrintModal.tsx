"use client";

import type { Certificate } from "@/lib/api/welfare";

/**
 * 증명서 서식 미리보기 + 인쇄.
 * 브라우저 인쇄(Ctrl/Cmd+P → PDF로 저장) 로 문서를 받는다.
 * 인쇄 시에는 .cert-sheet 영역만 남기고 나머지 화면 요소는 숨긴다(globals.css @media print).
 */
export function CertificatePrintModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
	const today = new Date();
	const issued = cert.issuedAt ? new Date(cert.issuedAt) : today;
	const fmt = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

	/** 증명서 종류별 본문 문구 */
	function body() {
		if (cert.certificateType === "경력증명서") {
			return "위 사람은 본 대학에 재직하며 아래와 같이 근무하였음을 증명합니다.";
		}
		if (cert.certificateType === "원천징수영수증") {
			return "위 사람의 근로소득 원천징수 내역이 아래와 같음을 증명합니다.";
		}
		return "위 사람은 현재 본 대학에 재직 중임을 증명합니다.";
	}

	return (
		<div className="modal-overlay cert-print-root">
			<div className="modal" style={{ maxWidth: "760px", width: "100%" }}>
				<div className="modal-head no-print">
					<div className="modal-title">증명서 미리보기</div>
					<button type="button" onClick={onClose} className="modal-x">&times;</button>
				</div>

				<div className="modal-body" style={{ background: "#F3F4F6", padding: "20px" }}>
					{/* 실제 인쇄되는 영역 */}
					<div className="cert-sheet">
						<div className="cert-docno">문서번호: {cert.documentNumber}</div>

						<h1 className="cert-title">{cert.certificateType}</h1>

						<table className="cert-table">
							<tbody>
								<tr>
									<th>성　명</th>
									<td>{cert.employeeName}</td>
									<th>사　번</th>
									<td>{cert.employeeNumber}</td>
								</tr>
								<tr>
									<th>소　속</th>
									<td>{cert.departmentName}</td>
									<th>직　급</th>
									<td>{cert.positionName}</td>
								</tr>
								<tr>
									<th>임용일</th>
									<td>{cert.hireDate ?? "-"}</td>
									<th>발급일</th>
									<td>{cert.issuedAt ? cert.issuedAt.slice(0, 10) : "-"}</td>
								</tr>
								<tr>
									<th>용　도</th>
									<td colSpan={3}>{cert.purpose || "-"}</td>
								</tr>
							</tbody>
						</table>

						<p className="cert-body">{body()}</p>

						<div className="cert-date">{fmt(issued)}</div>

						<div className="cert-issuer">
							경 복 대 학 교 총 장
							<span className="cert-seal">(직인)</span>
						</div>
					</div>
				</div>

				<div className="modal-foot no-print" style={{ padding: "14px 20px" }}>
					<button type="button" onClick={onClose} className="btn-ghost">닫기</button>
					<button type="button" onClick={() => window.print()} className="btn-primary">
						인쇄 / PDF 저장
					</button>
				</div>
			</div>
		</div>
	);
}
