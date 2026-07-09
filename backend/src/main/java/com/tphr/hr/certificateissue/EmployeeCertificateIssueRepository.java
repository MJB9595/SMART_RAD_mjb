package com.tphr.hr.certificateissue;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeCertificateIssueRepository extends JpaRepository<EmployeeCertificateIssue, Long> {

	List<EmployeeCertificateIssue> findByEmployee_IdAndDeletedFalseOrderByCreatedAtDesc(Long employeeId);

	List<EmployeeCertificateIssue> findByDeletedFalseOrderByCreatedAtDesc();
}
