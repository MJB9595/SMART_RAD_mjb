package com.tphr.hr.department;

import com.tphr.hr.department.dto.DepartmentRequest;
import com.tphr.hr.department.dto.DepartmentResponse;
import com.tphr.hr.department.dto.DepartmentTreeResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
public class DepartmentController {

	private final DepartmentService departmentService;

	@GetMapping
	public List<DepartmentResponse> getDepartments() {
		return departmentService.getDepartments();
	}

	@GetMapping("/tree")
	public List<DepartmentTreeResponse> getDepartmentTree() {
		return departmentService.getDepartmentTree();
	}

	@GetMapping("/{id}")
	public DepartmentResponse getDepartment(@PathVariable Long id) {
		return departmentService.getDepartment(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public DepartmentResponse createDepartment(@Valid @RequestBody DepartmentRequest request) {
		return departmentService.createDepartment(request);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public DepartmentResponse updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentRequest request) {
		return departmentService.updateDepartment(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteDepartment(@PathVariable Long id) {
		departmentService.deleteDepartment(id);
	}
}
