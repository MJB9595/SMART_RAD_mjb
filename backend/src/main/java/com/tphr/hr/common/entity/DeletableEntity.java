package com.tphr.hr.common.entity;

import jakarta.persistence.MappedSuperclass;

/** 업무 트랜잭션 테이블용 — 감사/버전만 (active 없음). */
@MappedSuperclass
public abstract class DeletableEntity extends AuditedEntity {
}
