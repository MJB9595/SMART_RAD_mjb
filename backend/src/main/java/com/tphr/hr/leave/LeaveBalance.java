package com.tphr.hr.leave;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.common.exception.ApiException;
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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "leave_balance")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LeaveBalance extends DeletableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(nullable = false)
	private int year;

	@Column(name = "total_granted", nullable = false, precision = 4, scale = 1)
	private BigDecimal totalGranted;

	@Column(name = "used_days", nullable = false, precision = 4, scale = 1)
	private BigDecimal usedDays;

	@Column(nullable = false, precision = 4, scale = 1)
	private BigDecimal remaining;

	/** 연차 승인 시 사용일수 차감. 잔여 부족 시 예외. */
	public void consume(BigDecimal days) {
		if (this.remaining.compareTo(days) < 0) {
			throw ApiException.conflict("잔여 연차가 부족합니다. (잔여 " + this.remaining + "일, 신청 " + days + "일)");
		}
		this.usedDays = this.usedDays.add(days);
		this.remaining = this.remaining.subtract(days);
	}
}
