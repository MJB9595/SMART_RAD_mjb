package com.tphr.hr.system;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

	@EntityGraph(attributePaths = {"permissions"})
	List<Role> findByDeletedFalseOrderByCodeAsc();
}
