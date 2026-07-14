package com.tphr.hr.department;

import com.tphr.hr.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "department")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Department extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 100)
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(name = "org_type", nullable = false, length = 20)
	private OrgType orgType;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_department_id")
	private Department parentDepartment;

	@Column(nullable = false)
	private int headcount;

	public Department(String name, OrgType orgType, Department parentDepartment, int headcount) {
		this.name = name;
		this.orgType = orgType;
		this.parentDepartment = parentDepartment;
		this.headcount = headcount;
	}

	public void update(String name, OrgType orgType, Department parentDepartment, int headcount) {
		this.name = name;
		this.orgType = orgType;
		this.parentDepartment = parentDepartment;
		this.headcount = headcount;
	}
}
