package com.tphr.hr.records;

import com.tphr.hr.records.dto.CareerRequest;
import com.tphr.hr.records.dto.CareerResponse;
import com.tphr.hr.records.dto.CertificationRequest;
import com.tphr.hr.records.dto.CertificationResponse;
import com.tphr.hr.records.dto.EducationRequest;
import com.tphr.hr.records.dto.EducationResponse;
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
@RequestMapping
@RequiredArgsConstructor
public class RecordController {

	private final RecordService recordService;

	// ===== 학력 =====
	@GetMapping("/employees/{employeeId}/educations")
	public List<EducationResponse> getEducations(@PathVariable Long employeeId) {
		return recordService.getEducations(employeeId);
	}

	@PostMapping("/employees/{employeeId}/educations")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public EducationResponse addEducation(@PathVariable Long employeeId, @Valid @RequestBody EducationRequest req) {
		return recordService.addEducation(employeeId, req);
	}

	@PutMapping("/educations/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public EducationResponse updateEducation(@PathVariable Long id, @Valid @RequestBody EducationRequest req) {
		return recordService.updateEducation(id, req);
	}

	@DeleteMapping("/educations/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteEducation(@PathVariable Long id) {
		recordService.deleteEducation(id);
	}

	// ===== 경력 =====
	@GetMapping("/employees/{employeeId}/careers")
	public List<CareerResponse> getCareers(@PathVariable Long employeeId) {
		return recordService.getCareers(employeeId);
	}

	@PostMapping("/employees/{employeeId}/careers")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public CareerResponse addCareer(@PathVariable Long employeeId, @Valid @RequestBody CareerRequest req) {
		return recordService.addCareer(employeeId, req);
	}

	@PutMapping("/careers/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public CareerResponse updateCareer(@PathVariable Long id, @Valid @RequestBody CareerRequest req) {
		return recordService.updateCareer(id, req);
	}

	@DeleteMapping("/careers/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteCareer(@PathVariable Long id) {
		recordService.deleteCareer(id);
	}

	// ===== 자격증 =====
	@GetMapping("/employees/{employeeId}/certifications")
	public List<CertificationResponse> getCertifications(@PathVariable Long employeeId) {
		return recordService.getCertifications(employeeId);
	}

	@PostMapping("/employees/{employeeId}/certifications")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public CertificationResponse addCertification(@PathVariable Long employeeId,
			@Valid @RequestBody CertificationRequest req) {
		return recordService.addCertification(employeeId, req);
	}

	@PutMapping("/certifications/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public CertificationResponse updateCertification(@PathVariable Long id,
			@Valid @RequestBody CertificationRequest req) {
		return recordService.updateCertification(id, req);
	}

	@DeleteMapping("/certifications/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteCertification(@PathVariable Long id) {
		recordService.deleteCertification(id);
	}
}
