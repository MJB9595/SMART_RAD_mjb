package com.tphr.hr.leave;

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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "leave_request")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LeaveRequest extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "leave_request_id")
	private Long id;

	@Column(name = "document_number", nullable = false, unique = true, length = 30)
	private String documentNumber;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "leave_type_id")
	private LeaveType leaveType;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	@Column(name = "leave_days", nullable = false, precision = 4, scale = 1)
	private BigDecimal days;

	@Column(columnDefinition = "TEXT")
	private String reason;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 30)
	private ApprovalStatus approvalStatus;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "approver_id")
	private Employee approver;

	@Column(name = "approved_at")
	private LocalDateTime approvedAt;

	@Builder
	public LeaveRequest(String documentNumber, LeaveType leaveType, Employee employee, LocalDate startDate,
			LocalDate endDate, BigDecimal days, String reason) {
		this.documentNumber = documentNumber;
		this.leaveType = leaveType;
		this.employee = employee;
		this.startDate = startDate;
		this.endDate = endDate;
		this.days = days;
		this.reason = reason;
		this.approvalStatus = ApprovalStatus.PENDING;
	}

	public void approve(Employee approver) {
		this.approvalStatus.ensurePending();
		this.approvalStatus = ApprovalStatus.APPROVED;
		this.approver = approver;
		this.approvedAt = LocalDateTime.now();
	}

	public void reject(Employee approver) {
		this.approvalStatus.ensurePending();
		this.approvalStatus = ApprovalStatus.REJECTED;
		this.approver = approver;
		this.approvedAt = LocalDateTime.now();
	}
}
