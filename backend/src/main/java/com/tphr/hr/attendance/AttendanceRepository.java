package com.tphr.hr.attendance;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	List<Attendance> findByWorkDateAndDeletedFalseOrderByEmployee_EmployeeNumberAsc(LocalDate workDate);

	Optional<Attendance> findByEmployee_IdAndWorkDateAndDeletedFalse(Long employeeId, LocalDate workDate);

	long countByWorkDateAndStatusAndDeletedFalse(LocalDate workDate, AttendanceStatus status);

	/** 월 근태 집계용: 기간 내 근태를 직원·소속과 함께 로딩(N+1 차단). */
	@EntityGraph(attributePaths = {"employee", "employee.department"})
	List<Attendance> findByWorkDateBetweenAndDeletedFalseOrderByEmployee_EmployeeNumberAsc(
			LocalDate start, LocalDate end);
}
