package com.tphr.hr.system;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

	/**
	 * created_at 은 초 단위(datetime)라 같은 초에 쌓인 이력의 선후를 구분하지 못한다.
	 * append-only 로그이므로 auto-increment id 역순이 곧 정확한 최신순이다.
	 */
	Page<AuditLog> findByOrderByIdDesc(Pageable pageable);
}
