package com.tphr.hr.employmenttype;

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
@Table(name = "employment_type")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmploymentType extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 50)
	private String name;

	public EmploymentType(String name) {
		this.name = name;
	}

	public void update(String name) {
		this.name = name;
	}
}
