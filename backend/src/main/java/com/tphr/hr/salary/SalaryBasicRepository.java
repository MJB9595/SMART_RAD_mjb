package com.tphr.hr.salary;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaryBasicRepository extends JpaRepository<SalaryBasic, Long> {

	@EntityGraph(attributePaths = {"employee", "employee.department", "employee.position"})
	List<SalaryBasic> findByDeletedFalseOrderByEmployee_EmployeeNumberAsc();
}
