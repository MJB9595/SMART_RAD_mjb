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
@Table(name = "employee_family")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Family extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "employee_family_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "family_name", nullable = false, length = 100)
	private String familyName;

	@Column(name = "family_relation", nullable = false, length = 50)
	private String familyRelation;

	@Column(name = "birth_date")
	private LocalDate birthDate;

	@Column(length = 100)
	private String job;

	@Column(name = "living_together")
	private Boolean livingTogether;

	@Column(name = "dependent")
	private Boolean dependent;

	@Column(name = "disabled")
	private Boolean disabled;

	@Builder
	public Family(Employee employee, String familyName, String familyRelation, LocalDate birthDate, String job,
			Boolean livingTogether, Boolean dependent, Boolean disabled) {
		this.employee = employee;
		this.familyName = familyName;
		this.familyRelation = familyRelation;
		this.birthDate = birthDate;
		this.job = job;
		this.livingTogether = livingTogether;
		this.dependent = dependent;
		this.disabled = disabled;
	}

	public void update(String familyName, String familyRelation, LocalDate birthDate, String job,
			Boolean livingTogether, Boolean dependent, Boolean disabled) {
		this.familyName = familyName;
		this.familyRelation = familyRelation;
		this.birthDate = birthDate;
		this.job = job;
		this.livingTogether = livingTogether;
		this.dependent = dependent;
		this.disabled = disabled;
	}
}
