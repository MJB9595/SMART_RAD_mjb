package com.tphr.hr.records;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MilitaryRepository extends JpaRepository<Military, Long> {

	Optional<Military> findByIdAndDeletedFalse(Long id);

	List<Military> findByEmployee_IdAndDeletedFalseOrderByEnlistmentDateDesc(Long employeeId);
}
