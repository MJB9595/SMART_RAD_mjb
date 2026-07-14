package com.tphr.hr.salary;

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
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "salary_basic")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SalaryBasic extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "base_pay", nullable = false, precision = 12, scale = 0)
	private BigDecimal basePay;

	@Column(name = "meal_allowance", nullable = false, precision = 12, scale = 0)
	private BigDecimal mealAllowance;

	@Column(name = "transport_allowance", nullable = false, precision = 12, scale = 0)
	private BigDecimal transportAllowance;

	@Column(name = "position_allowance", nullable = false, precision = 12, scale = 0)
	private BigDecimal positionAllowance;

	@Column(name = "bank_name", length = 50)
	private String bankName;

	@Column(name = "account_number", length = 50)
	private String accountNumber;

	@Column(name = "account_holder", length = 50)
	private String accountHolder;

	@Column(name = "effective_date", nullable = false)
	private LocalDate effectiveDate;

	public BigDecimal totalAllowance() {
		return mealAllowance.add(transportAllowance).add(positionAllowance);
	}

	public BigDecimal totalPay() {
		return basePay.add(totalAllowance());
	}
}
