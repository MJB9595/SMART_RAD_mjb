package com.tphr.hr.leave;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

	Optional<LeaveRequest> findByIdAndDeletedFalse(Long id);

	@EntityGraph(attributePaths = {"employee", "approver"})
	Page<LeaveRequest> findByDeletedFalseOrderByCreatedAtDesc(Pageable pageable);
}
