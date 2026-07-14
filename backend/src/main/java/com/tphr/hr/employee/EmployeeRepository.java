package com.tphr.hr.employee;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

	Optional<Employee> findByIdAndDeletedFalse(Long id);

	Optional<Employee> findByEmailAndDeletedFalse(String email);

	boolean existsByEmployeeNumber(String employeeNumber);

	boolean existsByEmail(String email);

	long countByDepartment_IdAndDeletedFalse(Long departmentId);

	/** 목록 조회 시 연관 엔티티를 함께 로딩해 N+1을 차단한다. */
	@Override
	@EntityGraph(attributePaths = {"department", "position", "employmentType"})
	Page<Employee> findAll(Specification<Employee> spec, Pageable pageable);
}
