package com.tphr.hr.signup;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApprovalSlotRepository extends JpaRepository<ApprovalSlot, Long> {

	Optional<ApprovalSlot> findByIdAndDeletedFalse(Long id);

	@EntityGraph(attributePaths = {"department", "position", "employmentType"})
	List<ApprovalSlot> findByStatusAndDeletedFalseOrderByIdAsc(SlotStatus status);
}
