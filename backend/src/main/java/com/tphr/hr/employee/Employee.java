package com.tphr.hr.employee;

import com.tphr.hr.common.StaffCategory;
import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.department.Department;
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

@Getter
@Entity
@Table(name = "employee")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Employee extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "employee_number", nullable = false, unique = true, length = 20)
	private String employeeNumber;

	@Column(nullable = false, length = 50)
	private String name;

	@Column(nullable = false, unique = true, length = 100)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(length = 20)
	private String phone;

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

	/** JWT 인증용 대표 권한 (상세 RBAC는 employee_role). */
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private EmployeeRole role;

	@Enumerated(EnumType.STRING)
	@Column(name = "employment_status", nullable = false, length = 20)
	private EmploymentStatus employmentStatus;

	@Column(name = "hire_date", nullable = false)
	private LocalDate hireDate;

	@Column(name = "resign_date")
	private LocalDate resignDate;

	// 인사기록카드 확장 인적사항
	@Column(name = "birth_date")
	private LocalDate birthDate;

	@Column(length = 10)
	private String gender;

	@Column(length = 255)
	private String address;

	@Column(name = "emergency_contact", length = 50)
	private String emergencyContact;

	@Builder
	public Employee(String employeeNumber, String name, String email, String password, String phone,
			StaffCategory staffCategory, Department department, Position position, EmploymentType employmentType,
			EmployeeRole role, LocalDate hireDate, LocalDate birthDate, String gender, String address,
			String emergencyContact) {
		this.employeeNumber = employeeNumber;
		this.name = name;
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.staffCategory = staffCategory;
		this.department = department;
		this.position = position;
		this.employmentType = employmentType;
		this.role = role;
		this.employmentStatus = EmploymentStatus.EMPLOYED;
		this.hireDate = hireDate;
		this.birthDate = birthDate;
		this.gender = gender;
		this.address = address;
		this.emergencyContact = emergencyContact;
	}

	public void updateInfo(String name, String phone, Department department, Position position,
			EmploymentType employmentType, String address, String emergencyContact) {
		this.name = name;
		this.phone = phone;
		this.department = department;
		this.position = position;
		this.employmentType = employmentType;
		this.address = address;
		this.emergencyContact = emergencyContact;
	}

	/** 인사발령 반영 — 발령으로 바뀌는 것은 소속/직급뿐. */
	public void applyAppointment(Department toDepartment, Position toPosition) {
		if (toDepartment != null) {
			this.department = toDepartment;
		}
		if (toPosition != null) {
			this.position = toPosition;
		}
	}

	public void changeEmploymentStatus(EmploymentStatus employmentStatus, LocalDate resignDate) {
		this.employmentStatus = employmentStatus;
		this.resignDate = resignDate;
	}

	public void changePassword(String encodedPassword) {
		this.password = encodedPassword;
	}
}
