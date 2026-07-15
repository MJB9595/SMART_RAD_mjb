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
@Table(name = "employee_military")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Military extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "employee_military_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "military_type", length = 100)
	private String militaryType;

	@Column(name = "military_rank", length = 100)
	private String militaryRank;

	@Column(name = "discharge_type", length = 100)
	private String dischargeType;

	@Column(name = "enlistment_date")
	private LocalDate enlistmentDate;

	@Column(name = "discharge_date")
	private LocalDate dischargeDate;

	@Column(name = "exemption_reason", length = 200)
	private String exemptionReason;

	@Builder
	public Military(Employee employee, String militaryType, String militaryRank, String dischargeType,
			LocalDate enlistmentDate, LocalDate dischargeDate, String exemptionReason) {
		this.employee = employee;
		this.militaryType = militaryType;
		this.militaryRank = militaryRank;
		this.dischargeType = dischargeType;
		this.enlistmentDate = enlistmentDate;
		this.dischargeDate = dischargeDate;
		this.exemptionReason = exemptionReason;
	}

	public void update(String militaryType, String militaryRank, String dischargeType, LocalDate enlistmentDate,
			LocalDate dischargeDate, String exemptionReason) {
		this.militaryType = militaryType;
		this.militaryRank = militaryRank;
		this.dischargeType = dischargeType;
		this.enlistmentDate = enlistmentDate;
		this.dischargeDate = dischargeDate;
		this.exemptionReason = exemptionReason;
	}
}
