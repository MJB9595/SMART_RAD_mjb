package com.tphr.hr.payroll;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

	@EntityGraph(attributePaths = {"employee"})
	List<Payroll> findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc();
}
