package com.tphr.hr.system.dto;

import com.tphr.hr.system.AuditLog;
import java.time.LocalDateTime;

public record AuditLogResponse(
		Long id,
		Long actorId,
		String action,
		String entityType,
		Long entityId,
		LocalDateTime createdAt
) {

	public static AuditLogResponse from(AuditLog a) {
		return new AuditLogResponse(a.getId(), a.getActorId(), a.getAction(), a.getEntityType(), a.getEntityId(),
				a.getCreatedAt());
	}
}
