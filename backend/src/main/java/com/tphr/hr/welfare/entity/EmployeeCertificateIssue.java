package com.tphr.hr.welfare.entity;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.employee.Employee;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "employee_certificate_issue")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeCertificateIssue extends DeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_certificate_issue_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "document_number", nullable = false, unique = true, length = 30)
    private String documentNumber;

    @Column(name = "certificate_type", nullable = false, length = 100)
    private String certificateType;

    @Column(name = "application_date", nullable = false)
    private LocalDate applicationDate;

    @Column(name = "purpose", length = 500)
    private String purpose;

    @Column(name = "issue_status", nullable = false, length = 50)
    private String issueStatus = "WAITING"; // WAITING/ISSUED/REJECTED

    @Column(name = "issued_at")
    private LocalDateTime issuedAt;

    @Column(name = "approval_status", nullable = false, length = 50)
    private String approvalStatus = "PENDING"; // PENDING/APPROVED/REJECTED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private Employee approver;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "memo", length = 1000)
    private String memo;

    @Builder
    public EmployeeCertificateIssue(Employee employee, String documentNumber, String certificateType,
                                    LocalDate applicationDate, String purpose) {
        this.employee = employee;
        this.documentNumber = documentNumber;
        this.certificateType = certificateType;
        this.applicationDate = applicationDate;
        this.purpose = purpose;
        this.issueStatus = "WAITING";
        this.approvalStatus = "PENDING";
    }

    public void approve(Employee approver) {
        this.approvalStatus = "APPROVED";
        this.issueStatus = "ISSUED";
        this.approver = approver;
        this.approvedAt = LocalDateTime.now();
        this.issuedAt = LocalDateTime.now();
    }
    
    public void reject(Employee approver, String memo) {
        this.approvalStatus = "REJECTED";
        this.issueStatus = "REJECTED";
        this.approver = approver;
        this.approvedAt = LocalDateTime.now();
        this.memo = memo;
    }
}
