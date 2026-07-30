package com.tphr.hr.employee;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

	Optional<Employee> findByIdAndDeletedFalse(Long id);

	@EntityGraph(attributePaths = {"department", "position", "employmentType"})
	Optional<Employee> findByEmailAndDeletedFalse(String email);

	boolean existsByEmployeeNumber(String employeeNumber);

	boolean existsByEmail(String email);

	long countByDepartment_IdAndDeletedFalse(Long departmentId);

	/** 선택 상자용 전체 목록 (재직 여부와 무관하게 활성 계정). */
	@EntityGraph(attributePaths = {"department", "position"})
	List<Employee> findByDeletedFalseOrderByNameAsc();

	/** 선택 상자용 — 지정한 역할을 제외한 목록 (인사팀은 관리자 계정을 고를 수 없다). */
	@EntityGraph(attributePaths = {"department", "position"})
	List<Employee> findByDeletedFalseAndRoleNotOrderByNameAsc(EmployeeRole role);

	/** 목록 조회 시 연관 엔티티를 함께 로딩해 N+1을 차단한다. */
	@Override
	@EntityGraph(attributePaths = {"department", "position", "employmentType"})
	Page<Employee> findAll(Specification<Employee> spec, Pageable pageable);
}
