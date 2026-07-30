package com.tphr.hr.leave;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

	Optional<LeaveRequest> findByIdAndDeletedFalse(Long id);

	@EntityGraph(attributePaths = {"employee", "approver", "leaveType"})
	Page<LeaveRequest> findByDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

	/** 본인 휴가 신청만 — 승인 권한이 없는 사용자에게 돌려준다. */
	Page<LeaveRequest> findByEmployee_IdAndDeletedFalseOrderByCreatedAtDesc(Long employeeId, Pageable pageable);
}
