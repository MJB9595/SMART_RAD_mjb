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
@Table(name = "certification")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Certification extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(length = 100)
	private String issuer;

	@Column(name = "cert_number", length = 100)
	private String certNumber;

	@Column(name = "acquired_date")
	private LocalDate acquiredDate;

	@Column(name = "expiry_date")
	private LocalDate expiryDate;

	@Builder
	public Certification(Employee employee, String name, String issuer, String certNumber, LocalDate acquiredDate,
			LocalDate expiryDate) {
		this.employee = employee;
		this.name = name;
		this.issuer = issuer;
		this.certNumber = certNumber;
		this.acquiredDate = acquiredDate;
		this.expiryDate = expiryDate;
	}

	public void update(String name, String issuer, String certNumber, LocalDate acquiredDate, LocalDate expiryDate) {
		this.name = name;
		this.issuer = issuer;
		this.certNumber = certNumber;
		this.acquiredDate = acquiredDate;
		this.expiryDate = expiryDate;
	}
}
