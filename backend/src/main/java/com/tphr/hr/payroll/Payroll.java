package com.tphr.hr.payroll;

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

/** 급여 명세서. */
@Getter
@Entity
@Table(name = "payroll")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payroll extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "payroll_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "payroll_year_month", nullable = false, length = 6)
	private String payrollYearMonth;

	@Column(name = "payment_date")
	private LocalDate paymentDate;

	@Column(name = "total_pay_amount", nullable = false, precision = 15, scale = 2)
	private BigDecimal totalPayAmount;

	@Column(name = "total_deduction_amount", nullable = false, precision = 15, scale = 2)
	private BigDecimal totalDeductionAmount;

	@Column(name = "real_pay_amount", nullable = false, precision = 15, scale = 2)
	private BigDecimal realPayAmount;

	@Column(name = "payroll_status_code", length = 30)
	private String payrollStatusCode;

	@Column(name = "employee_name_snapshot", length = 100)
	private String employeeNameSnapshot;

	@Column(name = "department_name_snapshot", length = 100)
	private String departmentNameSnapshot;

	@Column(name = "position_name_snapshot", length = 100)
	private String positionNameSnapshot;
}
