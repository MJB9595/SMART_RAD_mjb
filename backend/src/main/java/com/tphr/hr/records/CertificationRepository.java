package com.tphr.hr.records;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificationRepository extends JpaRepository<Certification, Long> {

	Optional<Certification> findByIdAndDeletedFalse(Long id);

	List<Certification> findByEmployee_IdAndDeletedFalseOrderByAcquiredDateDesc(Long employeeId);
}
