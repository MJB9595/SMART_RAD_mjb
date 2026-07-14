package com.tphr.hr.system;

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
@Table(name = "common_code")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommonCode extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "group_code", nullable = false, length = 50)
	private String groupCode;

	@Column(nullable = false, length = 50)
	private String code;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(name = "sort_order", nullable = false)
	private int sortOrder;

	@Column(name = "parent_code", length = 50)
	private String parentCode;

	public CommonCode(String groupCode, String code, String name, int sortOrder, String parentCode) {
		this.groupCode = groupCode;
		this.code = code;
		this.name = name;
		this.sortOrder = sortOrder;
		this.parentCode = parentCode;
	}

	public void update(String name, int sortOrder, String parentCode) {
		this.name = name;
		this.sortOrder = sortOrder;
		this.parentCode = parentCode;
	}
}
