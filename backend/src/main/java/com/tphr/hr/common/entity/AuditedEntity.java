package com.tphr.hr.common.entity;

import com.tphr.hr.common.exception.ApiException;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import java.time.LocalDateTime;
import lombok.Getter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/** 모든 업무 테이블의 공통 감사 컬럼 + 낙관적 락. */
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditedEntity {

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(nullable = false)
	private LocalDateTime updatedAt;

	@CreatedBy
	@Column(name = "created_by", updatable = false)
	private Long createdBy;

	@LastModifiedBy
	@Column(name = "updated_by")
	private Long updatedBy;

	@Version
	@Column(nullable = false)
	private Long version;

	@Column(nullable = false)
	private boolean deleted = false;

	public void delete() {
		this.deleted = true;
	}

	/**
	 * 낙관적 락 방어 — 클라이언트가 조회한 시점의 version과 현재 version이 다르면(그 사이 누가 수정) 409.
	 * expectedVersion 이 null 이면(구버전 클라이언트) 검증을 건너뛴다.
	 */
	public void checkOptimisticVersion(Long expectedVersion) {
		if (expectedVersion != null && !expectedVersion.equals(this.version)) {
			throw ApiException.conflict("다른 사용자가 먼저 수정했습니다. 새로고침 후 다시 시도하세요.");
		}
	}
}
