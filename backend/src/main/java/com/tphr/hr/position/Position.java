package com.tphr.hr.position;

import com.tphr.hr.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "position")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Position extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "position_id")
	private Long id;

	@Column(name = "position_name", nullable = false, length = 50)
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private PositionCategory category;

	/** DB 컬럼은 level (직급 레벨), 정렬 기준으로 사용. */
	@Column(name = "level", nullable = false)
	private int sortOrder;

	public Position(String name, PositionCategory category, int sortOrder) {
		this.name = name;
		this.category = category;
		this.sortOrder = sortOrder;
	}

	public void update(String name, PositionCategory category, int sortOrder) {
		this.name = name;
		this.category = category;
		this.sortOrder = sortOrder;
	}
}
