package com.tphr.hr.employee;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.department.Department;
import com.tphr.hr.department.DepartmentRepository;
import com.tphr.hr.employee.dto.EmployeeCreateRequest;
import com.tphr.hr.employee.dto.EmployeeResponse;
import com.tphr.hr.employee.dto.EmployeeStatusRequest;
import com.tphr.hr.employee.dto.EmployeeUpdateRequest;
import com.tphr.hr.employee.dto.PasswordChangeRequest;
import com.tphr.hr.employmenttype.EmploymentType;
import com.tphr.hr.employmenttype.EmploymentTypeRepository;
import com.tphr.hr.position.Position;
import com.tphr.hr.position.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeService {

	private final EmployeeRepository employeeRepository;
	private final DepartmentRepository departmentRepository;
	private final PositionRepository positionRepository;
	private final EmploymentTypeRepository employmentTypeRepository;
	private final PasswordEncoder passwordEncoder;

	public Page<EmployeeResponse> searchEmployees(String keyword, Long departmentId, Long positionId,
			EmploymentStatus employmentStatus, Pageable pageable) {
		return employeeRepository
				.findAll(EmployeeSpecifications.search(keyword, departmentId, positionId, employmentStatus), pageable)
				.map(EmployeeResponse::from);
	}

	public EmployeeResponse getEmployee(Long id) {
		return EmployeeResponse.from(findActiveEmployee(id));
	}

	@Transactional
	public EmployeeResponse createEmployee(EmployeeCreateRequest request) {
		if (employeeRepository.existsByEmployeeNumber(request.employeeNumber())) {
			throw ApiException.conflict("이미 존재하는 사원번호입니다.");
		}
		if (employeeRepository.existsByEmail(request.email())) {
			throw ApiException.conflict("이미 존재하는 이메일입니다.");
		}

		Department department = findDepartment(request.departmentId());
		Position position = findPosition(request.positionId());
		EmploymentType employmentType = findEmploymentType(request.employmentTypeId());

		Employee employee = new Employee(
				request.employeeNumber(),
				request.name(),
				request.email(),
				passwordEncoder.encode(request.password()),
				request.phone(),
				department,
				position,
				employmentType,
				request.role(),
				request.hireDate()
		);
		return EmployeeResponse.from(employeeRepository.save(employee));
	}

	@Transactional
	public EmployeeResponse updateEmployee(Long id, EmployeeUpdateRequest request) {
		Employee employee = findActiveEmployee(id);
		Department department = findDepartment(request.departmentId());
		Position position = findPosition(request.positionId());
		EmploymentType employmentType = findEmploymentType(request.employmentTypeId());

		employee.updateInfo(request.name(), request.phone(), department, position, employmentType);
		return EmployeeResponse.from(employee);
	}

	@Transactional
	public EmployeeResponse changeEmploymentStatus(Long id, EmployeeStatusRequest request) {
		Employee employee = findActiveEmployee(id);
		employee.changeEmploymentStatus(request.employmentStatus(), request.resignDate());
		return EmployeeResponse.from(employee);
	}

	@Transactional
	public void changePassword(Long id, PasswordChangeRequest request) {
		Employee employee = findActiveEmployee(id);
		employee.changePassword(passwordEncoder.encode(request.newPassword()));
	}

	@Transactional
	public void deleteEmployee(Long id) {
		findActiveEmployee(id).delete();
	}

	private Employee findActiveEmployee(Long id) {
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("사원을 찾을 수 없습니다. id=" + id));
		if (employee.isDeleted()) {
			throw ApiException.notFound("사원을 찾을 수 없습니다. id=" + id);
		}
		return employee;
	}

	private Department findDepartment(Long id) {
		return departmentRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("부서를 찾을 수 없습니다. id=" + id));
	}

	private Position findPosition(Long id) {
		return positionRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("직급을 찾을 수 없습니다. id=" + id));
	}

	private EmploymentType findEmploymentType(Long id) {
		return employmentTypeRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("사원타입을 찾을 수 없습니다. id=" + id));
	}
}
