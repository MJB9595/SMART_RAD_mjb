package com.tphr.hr.system;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 감사로그 (append-only). */
@Getter
@Entity
@Table(name = "audit_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AuditLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "actor_id")
	private Long actorId;

	@Column(nullable = false, length = 50)
	private String action;

	@Column(name = "entity_type", length = 50)
	private String entityType;

	@Column(name = "entity_id")
	private Long entityId;

	@Column(name = "before_data", columnDefinition = "TEXT")
	private String beforeData;

	@Column(name = "after_data", columnDefinition = "TEXT")
	private String afterData;

	@Column(name = "ip_address", length = 45)
	private String ipAddress;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	public AuditLog(Long actorId, String action, String entityType, Long entityId) {
		this.actorId = actorId;
		this.action = action;
		this.entityType = entityType;
		this.entityId = entityId;
		this.createdAt = LocalDateTime.now();
	}
}
