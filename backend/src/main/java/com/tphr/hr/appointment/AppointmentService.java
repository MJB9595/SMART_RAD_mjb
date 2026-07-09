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
import java.util.List;
import lombok.RequiredArgsConstructor;
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

	public List<AppointmentResponse> getAppointmentsByEmployee(Long employeeId) {
		return appointmentRepository.findByEmployee_IdAndDeletedFalseOrderByAppointmentDateDesc(employeeId).stream()
				.map(AppointmentResponse::from)
				.toList();
	}

	public List<AppointmentResponse> getAppointments() {
		return appointmentRepository.findByDeletedFalseOrderByAppointmentDateDesc().stream()
				.map(AppointmentResponse::from)
				.toList();
	}

	@Transactional
	public AppointmentResponse createAppointment(AppointmentRequest request) {
		Employee employee = employeeRepository.findById(request.employeeId())
				.orElseThrow(() -> ApiException.notFound("사원을 찾을 수 없습니다. id=" + request.employeeId()));
		Employee registeredBy = employeeRepository.findById(SecurityUtils.getCurrentEmployeeId())
				.orElseThrow(() -> ApiException.unauthorized("등록자 정보를 확인할 수 없습니다."));

		Department fromDepartment = findDepartmentOrNull(request.fromDepartmentId());
		Department toDepartment = findDepartmentOrNull(request.toDepartmentId());
		Position fromPosition = findPositionOrNull(request.fromPositionId());
		Position toPosition = findPositionOrNull(request.toPositionId());

		String documentNumber = documentNumberGenerator.generate(DOCUMENT_PREFIX);

		EmployeeAppointment appointment = new EmployeeAppointment(
				documentNumber,
				employee,
				request.appointmentType(),
				fromDepartment,
				toDepartment,
				fromPosition,
				toPosition,
				request.appointmentDate(),
				request.reason(),
				registeredBy
		);
		appointmentRepository.save(appointment);

		employee.updateInfo(
				employee.getName(),
				employee.getPhone(),
				toDepartment != null ? toDepartment : employee.getDepartment(),
				toPosition != null ? toPosition : employee.getPosition(),
				employee.getEmploymentType()
		);

		return AppointmentResponse.from(appointment);
	}

	private Department findDepartmentOrNull(Long id) {
		if (id == null) {
			return null;
		}
		return departmentRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("부서를 찾을 수 없습니다. id=" + id));
	}

	private Position findPositionOrNull(Long id) {
		if (id == null) {
			return null;
		}
		return positionRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("직급을 찾을 수 없습니다. id=" + id));
	}
}
