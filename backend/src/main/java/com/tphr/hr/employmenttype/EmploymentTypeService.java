package com.tphr.hr.employmenttype;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employmenttype.dto.EmploymentTypeRequest;
import com.tphr.hr.employmenttype.dto.EmploymentTypeResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmploymentTypeService {

	private final EmploymentTypeRepository employmentTypeRepository;

	public List<EmploymentTypeResponse> getEmploymentTypes() {
		return employmentTypeRepository.findByDeletedFalseOrderByNameAsc().stream()
				.map(EmploymentTypeResponse::from)
				.toList();
	}

	public EmploymentTypeResponse getEmploymentType(Long id) {
		return EmploymentTypeResponse.from(findActiveEmploymentType(id));
	}

	@Transactional
	public EmploymentTypeResponse createEmploymentType(EmploymentTypeRequest request) {
		EmploymentType employmentType = new EmploymentType(request.name());
		return EmploymentTypeResponse.from(employmentTypeRepository.save(employmentType));
	}

	@Transactional
	public EmploymentTypeResponse updateEmploymentType(Long id, EmploymentTypeRequest request) {
		EmploymentType employmentType = findActiveEmploymentType(id);
		employmentType.update(request.name());
		return EmploymentTypeResponse.from(employmentType);
	}

	@Transactional
	public void deleteEmploymentType(Long id) {
		findActiveEmploymentType(id).delete();
	}

	private EmploymentType findActiveEmploymentType(Long id) {
		EmploymentType employmentType = employmentTypeRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("사원타입을 찾을 수 없습니다. id=" + id));
		if (employmentType.isDeleted()) {
			throw ApiException.notFound("사원타입을 찾을 수 없습니다. id=" + id);
		}
		return employmentType;
	}
}
