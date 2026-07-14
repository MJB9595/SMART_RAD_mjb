package com.tphr.hr.appointment;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeAppointmentRepository extends JpaRepository<EmployeeAppointment, Long> {

	Optional<EmployeeAppointment> findByIdAndDeletedFalse(Long id);

	@EntityGraph(attributePaths = {"employee", "fromDepartment", "toDepartment", "fromPosition", "toPosition",
			"registeredBy", "approver"})
	Page<EmployeeAppointment> findByDeletedFalseOrderByAppointmentDateDesc(Pageable pageable);

	@EntityGraph(attributePaths = {"employee", "fromDepartment", "toDepartment", "fromPosition", "toPosition",
			"registeredBy", "approver"})
	Page<EmployeeAppointment> findByEmployee_IdAndDeletedFalseOrderByAppointmentDateDesc(Long employeeId,
			Pageable pageable);
}
