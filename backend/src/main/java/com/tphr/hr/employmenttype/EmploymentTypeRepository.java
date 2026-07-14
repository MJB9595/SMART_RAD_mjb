package com.tphr.hr.employmenttype;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmploymentTypeRepository extends JpaRepository<EmploymentType, Long> {

	Optional<EmploymentType> findByIdAndDeletedFalse(Long id);

	List<EmploymentType> findByDeletedFalseOrderByNameAsc();
}
