package com.tphr.hr.employee;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

	Optional<Employee> findByEmailAndDeletedFalse(String email);

	boolean existsByEmployeeNumber(String employeeNumber);

	boolean existsByEmail(String email);
}
