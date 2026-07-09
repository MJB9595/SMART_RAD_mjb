package com.tphr.hr.employmenttype;

import com.tphr.hr.employmenttype.dto.EmploymentTypeRequest;
import com.tphr.hr.employmenttype.dto.EmploymentTypeResponse;
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
@RequestMapping("/employment-types")
@RequiredArgsConstructor
public class EmploymentTypeController {

	private final EmploymentTypeService employmentTypeService;

	@GetMapping
	public List<EmploymentTypeResponse> getEmploymentTypes() {
		return employmentTypeService.getEmploymentTypes();
	}

	@GetMapping("/{id}")
	public EmploymentTypeResponse getEmploymentType(@PathVariable Long id) {
		return employmentTypeService.getEmploymentType(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public EmploymentTypeResponse createEmploymentType(@Valid @RequestBody EmploymentTypeRequest request) {
		return employmentTypeService.createEmploymentType(request);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public EmploymentTypeResponse updateEmploymentType(@PathVariable Long id,
			@Valid @RequestBody EmploymentTypeRequest request) {
		return employmentTypeService.updateEmploymentType(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteEmploymentType(@PathVariable Long id) {
		employmentTypeService.deleteEmploymentType(id);
	}
}
