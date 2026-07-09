package com.tphr.hr.department;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

	List<Department> findByDeletedFalseOrderByNameAsc();

	List<Department> findByParentDepartment_IdAndDeletedFalse(Long parentId);

	List<Department> findByParentDepartmentIsNullAndDeletedFalse();
}
