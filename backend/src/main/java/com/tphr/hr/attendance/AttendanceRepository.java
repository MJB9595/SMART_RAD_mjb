package com.tphr.hr.attendance;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	List<Attendance> findByWorkDateAndDeletedFalseOrderByEmployee_EmployeeNumberAsc(LocalDate workDate);

	Optional<Attendance> findByEmployee_IdAndWorkDateAndDeletedFalse(Long employeeId, LocalDate workDate);

	long countByWorkDateAndStatusAndDeletedFalse(LocalDate workDate, AttendanceStatus status);
}
