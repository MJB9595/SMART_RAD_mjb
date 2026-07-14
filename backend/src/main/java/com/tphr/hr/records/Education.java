package com.tphr.hr.records;

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
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "education")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Education extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "school_name", nullable = false, length = 100)
	private String schoolName;

	@Column(length = 100)
	private String major;

	@Column(length = 20)
	private String degree;

	@Column(name = "admission_date")
	private LocalDate admissionDate;

	@Column(name = "graduation_date")
	private LocalDate graduationDate;

	@Column(length = 20)
	private String status;

	@Builder
	public Education(Employee employee, String schoolName, String major, String degree, LocalDate admissionDate,
			LocalDate graduationDate, String status) {
		this.employee = employee;
		this.schoolName = schoolName;
		this.major = major;
		this.degree = degree;
		this.admissionDate = admissionDate;
		this.graduationDate = graduationDate;
		this.status = status;
	}

	public void update(String schoolName, String major, String degree, LocalDate admissionDate,
			LocalDate graduationDate, String status) {
		this.schoolName = schoolName;
		this.major = major;
		this.degree = degree;
		this.admissionDate = admissionDate;
		this.graduationDate = graduationDate;
		this.status = status;
	}
}
