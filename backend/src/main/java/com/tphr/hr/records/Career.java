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
@Table(name = "career")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Career extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "company_name", nullable = false, length = 100)
	private String companyName;

	@Column(length = 100)
	private String department;

	@Column(length = 50)
	private String position;

	@Column(name = "job_description", length = 500)
	private String jobDescription;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date")
	private LocalDate endDate;

	@Builder
	public Career(Employee employee, String companyName, String department, String position, String jobDescription,
			LocalDate startDate, LocalDate endDate) {
		this.employee = employee;
		this.companyName = companyName;
		this.department = department;
		this.position = position;
		this.jobDescription = jobDescription;
		this.startDate = startDate;
		this.endDate = endDate;
	}

	public void update(String companyName, String department, String position, String jobDescription,
			LocalDate startDate, LocalDate endDate) {
		this.companyName = companyName;
		this.department = department;
		this.position = position;
		this.jobDescription = jobDescription;
		this.startDate = startDate;
		this.endDate = endDate;
	}
}
