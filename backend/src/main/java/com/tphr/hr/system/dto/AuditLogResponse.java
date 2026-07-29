package com.tphr.hr.system.dto;

import com.tphr.hr.system.AuditLog;
import java.time.LocalDateTime;

public record AuditLogResponse(
		Long id,
		Long actorId,
		/** 행위자 이름. 계정이 지워졌거나 시스템 작업이면 null. */
		String actorName,
		String action,
		String entityType,
		Long entityId,
		LocalDateTime createdAt
) {

	public static AuditLogResponse from(AuditLog a, String actorName) {
		return new AuditLogResponse(a.getId(), a.getActorId(), actorName, a.getAction(), a.getEntityType(),
				a.getEntityId(), a.getCreatedAt());
	}
}
