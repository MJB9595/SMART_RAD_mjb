package com.tphr.hr.system;

import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

	List<Permission> findAllByOrderByCodeAsc();

	List<Permission> findByCodeIn(Set<String> codes);
}
