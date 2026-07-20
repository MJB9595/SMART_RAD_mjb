package com.tphr.hr.records;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepository extends JpaRepository<Language, Long> {

	Optional<Language> findByIdAndDeletedFalse(Long id);

	List<Language> findByEmployee_IdAndDeletedFalseOrderByLanguageNameAsc(Long employeeId);
}
