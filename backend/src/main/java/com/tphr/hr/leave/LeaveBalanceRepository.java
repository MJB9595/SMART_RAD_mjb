package com.tphr.hr.leave;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

	Optional<LeaveBalance> findByEmployee_IdAndLeaveType_IdAndYearAndDeletedFalse(Long employeeId, Long leaveTypeId,
			int year);

	@EntityGraph(attributePaths = {"employee", "employee.department", "leaveType"})
	List<LeaveBalance> findByYearAndDeletedFalseOrderByEmployee_EmployeeNumberAsc(int year);
}
