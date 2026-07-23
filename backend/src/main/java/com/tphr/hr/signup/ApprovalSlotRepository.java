package com.tphr.hr.signup;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApprovalSlotRepository extends JpaRepository<ApprovalSlot, Long> {

	Optional<ApprovalSlot> findByIdAndDeletedFalse(Long id);

	/** 매치 해제용: 특정 교직원으로 채워진(FILLED) 자리 조회. */
	Optional<ApprovalSlot> findByFilledEmployeeIdAndDeletedFalse(Long filledEmployeeId);

	@EntityGraph(attributePaths = {"department", "position", "employmentType"})
	List<ApprovalSlot> findByStatusAndDeletedFalseOrderByIdAsc(SlotStatus status);
}
