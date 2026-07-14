package com.tphr.hr.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

/** 기준정보 테이블용 — 감사/버전 + active 플래그. */
@Getter
@MappedSuperclass
public abstract class BaseEntity extends AuditedEntity {

	@Column(nullable = false)
	private boolean active = true;

	@Override
	public void delete() {
		super.delete();
		this.active = false;
	}

	public void activate() {
		this.active = true;
	}

	public void deactivate() {
		this.active = false;
	}
}
