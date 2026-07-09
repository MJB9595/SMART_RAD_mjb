package com.tphr.hr.eventsupport;

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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "employee_event_support")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeEventSupport extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "document_number", nullable = false, unique = true, length = 30)
	private String documentNumber;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Enumerated(EnumType.STRING)
	@Column(name = "event_type", nullable = false, length = 20)
	private EventType eventType;

	@Column(nullable = false, precision = 12, scale = 0)
	private BigDecimal amount;

	@Column(name = "event_date", nullable = false)
	private LocalDate eventDate;

	@Column(length = 500)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(name = "approval_status", nullable = false, length = 20)
	private ApprovalStatus approvalStatus;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "approver_id")
	private Employee approver;

	@Column(name = "approved_at")
	private LocalDateTime approvedAt;

	public EmployeeEventSupport(String documentNumber, Employee employee, EventType eventType, BigDecimal amount,
			LocalDate eventDate, String description) {
		this.documentNumber = documentNumber;
		this.employee = employee;
		this.eventType = eventType;
		this.amount = amount;
		this.eventDate = eventDate;
		this.description = description;
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
}
