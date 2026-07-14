package com.tphr.hr.appointment;

import com.tphr.hr.appointment.dto.AppointmentRequest;
import com.tphr.hr.appointment.dto.AppointmentResponse;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.common.util.DocumentNumberGenerator;
import com.tphr.hr.department.Department;
import com.tphr.hr.department.DepartmentRepository;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.position.Position;
import com.tphr.hr.position.PositionRepository;
import com.tphr.hr.security.SecurityUtils;
import com.tphr.hr.system.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppointmentService {

	private static final String DOCUMENT_PREFIX = "APT";

	private final EmployeeAppointmentRepository appointmentRepository;
	private final EmployeeRepository employeeRepository;
	private final DepartmentRepository departmentRepository;
	private final PositionRepository positionRepository;
	private final DocumentNumberGenerator documentNumberGenerator;
	private final AuditLogService auditLogService;

	public Page<AppointmentResponse> getAppointments(Pageable pageable) {
		return appointmentRepository.findByDeletedFalseOrderByAppointmentDateDesc(pageable)
				.map(AppointmentResponse::from);
	}

	public Page<AppointmentResponse> getAppointmentsByEmployee(Long employeeId, Pageable pageable) {
		return appointmentRepository.findByEmployee_IdAndDeletedFalseOrderByAppointmentDateDesc(employeeId, pageable)
				.map(AppointmentResponse::from);
	}

	@Transactional
	public AppointmentResponse createAppointment(AppointmentRequest request) {
		Employee employee = findEmployee(request.employeeId());
		Employee registeredBy = findEmployee(SecurityUtils.getCurrentEmployeeId());

		String documentNumber = documentNumberGenerator.generate(DOCUMENT_PREFIX);

		EmployeeAppointment appointment = EmployeeAppointment.builder()
				.documentNumber(documentNumber)
				.employee(employee)
				.appointmentType(request.appointmentType())
				.fromDepartment(findDepartmentOrNull(request.fromDepartmentId()))
				.toDepartment(findDepartmentOrNull(request.toDepartmentId()))
				.fromPosition(findPositionOrNull(request.fromPositionId()))
				.toPosition(findPositionOrNull(request.toPositionId()))
				.appointmentDate(request.appointmentDate())
				.reason(request.reason())
				.registeredBy(registeredBy)
				.build();

		return AppointmentResponse.from(appointmentRepository.save(appointment));
	}

	/** 승인 시에만 사원의 실제 소속/직급에 발령을 반영한다. */
	@Transactional
	public AppointmentResponse approve(Long id) {
		EmployeeAppointment appointment = findActive(id);
		Employee approver = findEmployee(SecurityUtils.getCurrentEmployeeId());

		appointment.approve(approver);
		appointment.getEmployee().applyAppointment(appointment.getToDepartment(), appointment.getToPosition());
		auditLogService.record("APPROVE", "APPOINTMENT", appointment.getId());

		return AppointmentResponse.from(appointment);
	}

	@Transactional
	public AppointmentResponse reject(Long id) {
		EmployeeAppointment appointment = findActive(id);
		Employee approver = findEmployee(SecurityUtils.getCurrentEmployeeId());
		appointment.reject(approver);
		return AppointmentResponse.from(appointment);
	}

	private EmployeeAppointment findActive(Long id) {
		return appointmentRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("발령을 찾을 수 없습니다. id=" + id));
	}

	private Employee findEmployee(Long id) {
		return employeeRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("교직원을 찾을 수 없습니다. id=" + id));
	}

	private Department findDepartmentOrNull(Long id) {
		return id == null ? null : departmentRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("조직을 찾을 수 없습니다. id=" + id));
	}

	private Position findPositionOrNull(Long id) {
		return id == null ? null : positionRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("직급을 찾을 수 없습니다. id=" + id));
	}
}
