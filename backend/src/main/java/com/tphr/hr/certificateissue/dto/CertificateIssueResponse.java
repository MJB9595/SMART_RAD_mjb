package com.tphr.hr.certificateissue.dto;

import com.tphr.hr.certificateissue.CertificateType;
import com.tphr.hr.certificateissue.EmployeeCertificateIssue;
import com.tphr.hr.certificateissue.IssueStatus;
import com.tphr.hr.common.ApprovalStatus;
import com.tphr.hr.employee.Employee;
import java.time.LocalDateTime;

public record CertificateIssueResponse(
		Long id,
		String documentNumber,
		Long employeeId,
		String employeeName,
		CertificateType certificateType,
		String purpose,
		IssueStatus issueStatus,
		ApprovalStatus approvalStatus,
		String approverName,
		LocalDateTime approvedAt,
		LocalDateTime issuedAt
) {

	public static CertificateIssueResponse from(EmployeeCertificateIssue certificateIssue) {
		Employee approver = certificateIssue.getApprover();
		return new CertificateIssueResponse(
				certificateIssue.getId(),
				certificateIssue.getDocumentNumber(),
				certificateIssue.getEmployee().getId(),
				certificateIssue.getEmployee().getName(),
				certificateIssue.getCertificateType(),
				certificateIssue.getPurpose(),
				certificateIssue.getIssueStatus(),
				certificateIssue.getApprovalStatus(),
				approver != null ? approver.getName() : null,
				certificateIssue.getApprovedAt(),
				certificateIssue.getIssuedAt()
		);
	}
}
