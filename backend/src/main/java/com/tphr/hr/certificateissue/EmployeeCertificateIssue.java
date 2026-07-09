package com.tphr.hr.certificateissue;

import com.tphr.hr.common.ApprovalStatus;
import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.employee.Employee;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "employee_certificate_issue")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeCertificateIssue extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "document_number", nullable = false, unique = true, length = 30)
	private String documentNumber;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Enumerated(EnumType.STRING)
	@Column(name = "certificate_type", nullable = false, length = 20)
	private CertificateType certificateType;

	@Column(length = 200)
	private String purpose;

	@Enumerated(EnumType.STRING)
	@Column(name = "issue_status", nullable = false, length = 20)
	private IssueStatus issueStatus;

	@Enumerated(EnumType.STRING)
	@Column(name = "approval_status", nullable = false, length = 20)
	private ApprovalStatus approvalStatus;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "approver_id")
	private Employee approver;

	@Column(name = "approved_at")
	private LocalDateTime approvedAt;

	@Column(name = "issued_at")
	private LocalDateTime issuedAt;

	public EmployeeCertificateIssue(String documentNumber, Employee employee, CertificateType certificateType,
			String purpose) {
		this.documentNumber = documentNumber;
		this.employee = employee;
		this.certificateType = certificateType;
		this.purpose = purpose;
		this.issueStatus = IssueStatus.PENDING;
		this.approvalStatus = ApprovalStatus.PENDING;
	}

	public void approve(Employee approver) {
		this.approvalStatus = ApprovalStatus.APPROVED;
		this.approver = approver;
		this.approvedAt = LocalDateTime.now();
	}

	public void reject(Employee approver) {
		this.approvalStatus = ApprovalStatus.REJECTED;
		this.approver = approver;
		this.approvedAt = LocalDateTime.now();
	}

	public void markIssued() {
		this.issueStatus = IssueStatus.ISSUED;
		this.issuedAt = LocalDateTime.now();
	}
}
