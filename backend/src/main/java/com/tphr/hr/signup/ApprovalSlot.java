package com.tphr.hr.signup;

import com.tphr.hr.common.StaffCategory;
import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.department.Department;
import com.tphr.hr.employee.EmployeeRole;
import com.tphr.hr.employmenttype.EmploymentType;
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
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 승인 자리(슬롯) — 관리자가 사번/이메일/비밀번호 없이 미리 정의해 두는 직위·권한 정의.
 * 회원가입 신청 승인 시 신청건(신원)과 매칭되어 정식 교직원 계정으로 채워진다(FILLED).
 */
@Getter
@Entity
@Table(name = "approval_slot")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApprovalSlot extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "approval_slot_id")
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(name = "staff_category", nullable = false, length = 20)
	private StaffCategory staffCategory;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "department_id")
	private Department department;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "position_id")
	private Position position;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employment_type_id")
	private EmploymentType employmentType;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private EmployeeRole role;

	@Column(name = "hire_date")
	private LocalDate hireDate;

	@Column(length = 100)
	private String label;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private SlotStatus status;

	@Column(name = "filled_employee_id")
	private Long filledEmployeeId;

	@Builder
	public ApprovalSlot(StaffCategory staffCategory, Department department, Position position,
			EmploymentType employmentType, EmployeeRole role, LocalDate hireDate, String label) {
		this.staffCategory = staffCategory;
		this.department = department;
		this.position = position;
		this.employmentType = employmentType;
		this.role = role;
		this.hireDate = hireDate;
		this.label = label;
		this.status = SlotStatus.OPEN;
	}

	public void fill(Long employeeId) {
		if (this.status != SlotStatus.OPEN) {
			throw ApiException.conflict("이미 채워진 자리입니다.");
		}
		this.status = SlotStatus.FILLED;
		this.filledEmployeeId = employeeId;
	}
}
