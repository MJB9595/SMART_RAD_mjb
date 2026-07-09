package com.tphr.hr.eventsupport;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeEventSupportRepository extends JpaRepository<EmployeeEventSupport, Long> {

	List<EmployeeEventSupport> findByEmployee_IdAndDeletedFalseOrderByCreatedAtDesc(Long employeeId);

	List<EmployeeEventSupport> findByDeletedFalseOrderByCreatedAtDesc();
}
