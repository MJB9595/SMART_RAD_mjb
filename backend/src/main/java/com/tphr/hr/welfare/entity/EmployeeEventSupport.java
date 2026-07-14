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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "employee_event_support")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeEventSupport extends DeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_event_support_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "document_number", nullable = false, unique = true, length = 30)
    private String documentNumber;

    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    @Column(name = "family_relation", length = 100)
    private String familyRelation;

    @Column(name = "target_name", nullable = false, length = 100)
    private String targetName;

    @Column(name = "application_date", nullable = false)
    private LocalDate applicationDate;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "requested_amount", nullable = false, precision = 12, scale = 0)
    private BigDecimal requestedAmount;

    @Column(name = "event_location", length = 255)
    private String eventLocation;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "account_number", length = 100)
    private String accountNumber;

    @Column(name = "account_holder", length = 100)
    private String accountHolder;

    @Column(name = "approval_status", nullable = false, length = 50)
    private String approvalStatus = "PENDING";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private Employee approver;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "memo", length = 1000)
    private String memo;

    @Builder
    public EmployeeEventSupport(Employee employee, String documentNumber, String eventType, String familyRelation,
                                String targetName, LocalDate applicationDate, LocalDate eventDate, BigDecimal requestedAmount,
                                String eventLocation, String bankName, String accountNumber, String accountHolder) {
        this.employee = employee;
        this.documentNumber = documentNumber;
        this.eventType = eventType;
        this.familyRelation = familyRelation;
        this.targetName = targetName;
        this.applicationDate = applicationDate;
        this.eventDate = eventDate;
        this.requestedAmount = requestedAmount;
        this.eventLocation = eventLocation;
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.approvalStatus = "PENDING";
    }

    public void approve(Employee approver) {
        this.approvalStatus = "APPROVED";
        this.approver = approver;
        this.approvedAt = LocalDateTime.now();
    }
    
    public void reject(Employee approver, String memo) {
        this.approvalStatus = "REJECTED";
        this.approver = approver;
        this.approvedAt = LocalDateTime.now();
        this.memo = memo;
    }
}
