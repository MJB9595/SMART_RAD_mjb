package com.tphr.hr.appointment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeAppointmentRepository extends JpaRepository<EmployeeAppointment, Long> {

	List<EmployeeAppointment> findByEmployee_IdAndDeletedFalseOrderByAppointmentDateDesc(Long employeeId);

	List<EmployeeAppointment> findByDeletedFalseOrderByAppointmentDateDesc();
}
