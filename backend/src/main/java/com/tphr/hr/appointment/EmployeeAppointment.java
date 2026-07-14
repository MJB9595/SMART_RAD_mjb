package com.tphr.hr.appointment;

import com.tphr.hr.common.ApprovalStatus;
import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.department.Department;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.position.Position;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "appointment")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeAppointment extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "document_number", nullable = false, unique = true, length = 30)
	private String documentNumber;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Enumerated(EnumType.STRING)
	@Column(name = "appointment_type", nullable = false, length = 30)
	private AppointmentType appointmentType;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "from_department_id")
	private Department fromDepartment;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "to_department_id")
	private Department toDepartment;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "from_position_id")
	private Position fromPosition;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "to_position_id")
	private Position toPosition;

	@Column(name = "appointment_date", nullable = false)
	private LocalDate appointmentDate;

	@Column(length = 500)
	private String reason;

	@Enumerated(EnumType.STRING)
	@Column(name = "approval_status", nullable = false, length = 20)
	private ApprovalStatus approvalStatus;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "approver_id")
	private Employee approver;

	@Column(name = "approved_at")
	private LocalDateTime approvedAt;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "registered_by")
	private Employee registeredBy;

	@Builder
	public EmployeeAppointment(String documentNumber, Employee employee, AppointmentType appointmentType,
			Department fromDepartment, Department toDepartment, Position fromPosition, Position toPosition,
			LocalDate appointmentDate, String reason, Employee registeredBy) {
		this.documentNumber = documentNumber;
		this.employee = employee;
		this.appointmentType = appointmentType;
		this.fromDepartment = fromDepartment;
		this.toDepartment = toDepartment;
		this.fromPosition = fromPosition;
		this.toPosition = toPosition;
		this.appointmentDate = appointmentDate;
		this.reason = reason;
		this.registeredBy = registeredBy;
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
