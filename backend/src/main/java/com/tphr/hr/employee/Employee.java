package com.tphr.hr.employee;

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

	@Enumerated(EnumType.STRING)
	@Column(name = "employment_status", nullable = false, length = 20)
	private EmploymentStatus employmentStatus;

	@Column(name = "hire_date", nullable = false)
	private LocalDate hireDate;

	@Column(name = "resign_date")
	private LocalDate resignDate;

	public Employee(String employeeNumber, String name, String email, String password, String phone,
			Department department, Position position, EmploymentType employmentType, EmployeeRole role,
			LocalDate hireDate) {
		this.employeeNumber = employeeNumber;
		this.name = name;
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.department = department;
		this.position = position;
		this.employmentType = employmentType;
		this.role = role;
		this.employmentStatus = EmploymentStatus.EMPLOYED;
		this.hireDate = hireDate;
	}

	public void updateInfo(String name, String phone, Department department, Position position,
			EmploymentType employmentType) {
		this.name = name;
		this.phone = phone;
		this.department = department;
		this.position = position;
		this.employmentType = employmentType;
	}

	public void changeEmploymentStatus(EmploymentStatus employmentStatus, LocalDate resignDate) {
		this.employmentStatus = employmentStatus;
		this.resignDate = resignDate;
	}

	public void changePassword(String encodedPassword) {
		this.password = encodedPassword;
	}
}
