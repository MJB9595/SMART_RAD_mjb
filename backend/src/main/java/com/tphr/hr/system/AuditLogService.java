package com.tphr.hr.system;

import com.tphr.hr.security.CustomUserDetails;
import com.tphr.hr.system.dto.AuditLogResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditLogService {

	private final AuditLogRepository auditLogRepository;

	@Transactional
	public void record(String action, String entityType, Long entityId) {
		auditLogRepository.save(new AuditLog(currentActorId(), action, entityType, entityId));
	}

	public Page<AuditLogResponse> getAuditLogs(Pageable pageable) {
		return auditLogRepository.findByOrderByCreatedAtDesc(pageable).map(AuditLogResponse::from);
	}

	private Long currentActorId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
			return userDetails.getEmployeeId();
		}
		return null;
	}
}
