package com.tphr.hr.records;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FamilyRepository extends JpaRepository<Family, Long> {

	Optional<Family> findByIdAndDeletedFalse(Long id);

	List<Family> findByEmployee_IdAndDeletedFalseOrderByBirthDateAsc(Long employeeId);
}
