package com.tphr.hr.system;

import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.security.CustomUserDetails;
import com.tphr.hr.system.dto.AuditLogResponse;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
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
	private final EmployeeRepository employeeRepository;

	@Transactional
	public void record(String action, String entityType, Long entityId) {
		auditLogRepository.save(new AuditLog(currentActorId(), action, entityType, entityId));
	}

	public Page<AuditLogResponse> getAuditLogs(Pageable pageable) {
		Page<AuditLog> page = auditLogRepository.findByOrderByIdDesc(pageable);
		// 한 페이지에 등장하는 행위자만 한 번에 조회해 이름을 붙인다 (행마다 조회하면 N+1)
		List<Long> actorIds = page.getContent().stream()
				.map(AuditLog::getActorId)
				.filter(Objects::nonNull)
				.distinct()
				.toList();
		Map<Long, String> names = actorIds.isEmpty()
				? Map.of()
				: employeeRepository.findAllById(actorIds).stream()
						.collect(Collectors.toMap(Employee::getId, Employee::getName, (a, b) -> a));
		return page.map(a -> AuditLogResponse.from(a, names.get(a.getActorId())));
	}

	private Long currentActorId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
			return userDetails.getEmployeeId();
		}
		return null;
	}
}
