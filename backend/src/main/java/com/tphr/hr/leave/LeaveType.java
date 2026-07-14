package com.tphr.hr.leave;

import com.tphr.hr.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 휴가 유형 마스터 (연차/병가/공가/특별휴가 등). */
@Getter
@Entity
@Table(name = "leave_type")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LeaveType extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "leave_type_id")
	private Long id;

	@Column(name = "leave_type_name", nullable = false, length = 100)
	private String name;

	@Column(name = "paid_yn", nullable = false)
	private boolean paid;

	@Column(name = "default_days", precision = 4, scale = 1)
	private BigDecimal defaultDays;

	@Column(length = 255)
	private String note;

	public LeaveType(String name, boolean paid, BigDecimal defaultDays, String note) {
		this.name = name;
		this.paid = paid;
		this.defaultDays = defaultDays;
		this.note = note;
	}

	/** 연차 여부(연차만 잔여일수에서 차감). */
	public boolean isAnnual() {
		return "연차".equals(name);
	}
}
