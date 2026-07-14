package com.tphr.hr.leave;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {

	Optional<LeaveType> findByIdAndDeletedFalse(Long id);

	List<LeaveType> findByDeletedFalseOrderByIdAsc();
}
