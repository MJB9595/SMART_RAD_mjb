package com.tphr.hr.system;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

	/**
	 * 계정 생성 시 열거값에 대응하는 RBAC 역할을 배정한다.
	 * 이 매핑이 없으면 권한 관리 화면에서 그 계정의 권한을 조정할 수 없다.
	 */
	@Modifying
	@Query(value = "INSERT IGNORE INTO employee_role (employee_id, role_id) "
			+ "SELECT :employeeId, role_id FROM role WHERE code = :roleCode AND deleted = FALSE",
			nativeQuery = true)
	void assignRoleByCode(@Param("employeeId") Long employeeId, @Param("roleCode") String roleCode);

	/** 이 교직원에게 배정된 역할 수 (비활성 포함). 0이면 RBAC 미배정 계정이라 열거값으로 대체한다. */
	@Query(value = "SELECT COUNT(*) FROM employee_role WHERE employee_id = :employeeId", nativeQuery = true)
	long countRolesOfEmployee(@Param("employeeId") Long employeeId);

	/** 이 교직원의 역할 중 활성인 것의 코드. 전부 비활성이면 빈 목록 → 접근 차단 대상. */
	@Query(value = """
			SELECT r.code FROM employee_role er
			  JOIN role r ON r.role_id = er.role_id
			WHERE er.employee_id = :employeeId AND r.active = TRUE AND r.deleted = FALSE
			""", nativeQuery = true)
	List<String> findActiveRoleCodesOfEmployee(@Param("employeeId") Long employeeId);

	/** 활성 역할을 통해 이 교직원이 실제로 갖는 권한 코드. */
	@Query(value = """
			SELECT DISTINCT p.code FROM employee_role er
			  JOIN role r ON r.role_id = er.role_id
			  JOIN role_permission rp ON rp.role_id = r.role_id
			  JOIN permission p ON p.permission_id = rp.permission_id
			WHERE er.employee_id = :employeeId AND r.active = TRUE AND r.deleted = FALSE
			""", nativeQuery = true)
	List<String> findActivePermissionCodesOfEmployee(@Param("employeeId") Long employeeId);
}
