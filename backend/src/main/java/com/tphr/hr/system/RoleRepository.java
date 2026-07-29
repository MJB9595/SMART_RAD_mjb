package com.tphr.hr.system;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoleRepository extends JpaRepository<Role, Long> {

	@EntityGraph(attributePaths = {"permissions"})
	List<Role> findByDeletedFalseOrderByCodeAsc();

	@EntityGraph(attributePaths = {"permissions"})
	Optional<Role> findByIdAndDeletedFalse(Long id);

	boolean existsByCodeAndDeletedFalse(String code);

	/**
	 * 이 역할을 부여받은 교직원 수.
	 * employee_role 은 JPA 엔티티가 없는 순수 조인 테이블이라 네이티브 쿼리로 센다.
	 */
	@Query(value = "SELECT COUNT(*) FROM employee_role WHERE role_id = :roleId", nativeQuery = true)
	long countEmployeesUsingRole(@Param("roleId") Long roleId);
}
