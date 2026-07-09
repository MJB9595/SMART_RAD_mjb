package com.tphr.hr.employmenttype;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmploymentTypeRepository extends JpaRepository<EmploymentType, Long> {

	List<EmploymentType> findByDeletedFalseOrderByNameAsc();
}
