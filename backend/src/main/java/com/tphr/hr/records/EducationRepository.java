package com.tphr.hr.records;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {

	Optional<Education> findByIdAndDeletedFalse(Long id);

	List<Education> findByEmployee_IdAndDeletedFalseOrderByGraduationDateDesc(Long employeeId);
}
