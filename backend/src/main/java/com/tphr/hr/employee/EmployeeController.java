package com.tphr.hr.employee;

import com.tphr.hr.common.StaffCategory;
import com.tphr.hr.employee.dto.EmployeeCreateRequest;
import com.tphr.hr.employee.dto.EmployeeResponse;
import com.tphr.hr.employee.dto.EmployeeStatusRequest;
import com.tphr.hr.employee.dto.EmployeeUpdateRequest;
import com.tphr.hr.employee.dto.PasswordChangeRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {

	private final EmployeeService employeeService;

	@GetMapping
	public Page<EmployeeResponse> searchEmployees(
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) Long departmentId,
			@RequestParam(required = false) Long positionId,
			@RequestParam(required = false) StaffCategory staffCategory,
			@RequestParam(required = false) EmploymentStatus employmentStatus,
			@PageableDefault(size = 20, sort = "employeeNumber", direction = Sort.Direction.ASC) Pageable pageable) {
		return employeeService.searchEmployees(keyword, departmentId, positionId, staffCategory, employmentStatus,
				pageable);
	}

	@GetMapping("/{id}")
	public EmployeeResponse getEmployee(@PathVariable Long id) {
		return employeeService.getEmployee(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public EmployeeResponse createEmployee(@Valid @RequestBody EmployeeCreateRequest request) {
		return employeeService.createEmployee(request);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public EmployeeResponse updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeUpdateRequest request) {
		return employeeService.updateEmployee(id, request);
	}

	@PatchMapping("/{id}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public EmployeeResponse changeEmploymentStatus(@PathVariable Long id,
			@Valid @RequestBody EmployeeStatusRequest request) {
		return employeeService.changeEmploymentStatus(id, request);
	}

	@PatchMapping("/{id}/password")
	@PreAuthorize("hasRole('ADMIN')")
	public void changePassword(@PathVariable Long id, @Valid @RequestBody PasswordChangeRequest request) {
		employeeService.changePassword(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteEmployee(@PathVariable Long id) {
		employeeService.deleteEmployee(id);
	}
}
