package com.tphr.hr.position;

import com.tphr.hr.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
	private Long id;

	@Column(nullable = false, length = 50)
	private String name;

	@Column(name = "sort_order", nullable = false)
	private int sortOrder;

	public Position(String name, int sortOrder) {
		this.name = name;
		this.sortOrder = sortOrder;
	}

	public void update(String name, int sortOrder) {
		this.name = name;
		this.sortOrder = sortOrder;
	}
}
