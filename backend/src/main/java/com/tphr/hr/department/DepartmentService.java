package com.tphr.hr.department;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.department.dto.DepartmentRequest;
import com.tphr.hr.department.dto.DepartmentResponse;
import com.tphr.hr.department.dto.DepartmentTreeResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentService {

	private final DepartmentRepository departmentRepository;

	public List<DepartmentResponse> getDepartments() {
		return departmentRepository.findByDeletedFalseOrderByNameAsc().stream()
				.map(DepartmentResponse::from)
				.toList();
	}

	public DepartmentResponse getDepartment(Long id) {
		return DepartmentResponse.from(findActive(id));
	}

	public List<DepartmentTreeResponse> getDepartmentTree() {
		return departmentRepository.findByParentDepartmentIsNullAndDeletedFalse().stream()
				.map(this::toTree)
				.toList();
	}

	private DepartmentTreeResponse toTree(Department department) {
		List<DepartmentTreeResponse> children = departmentRepository
				.findByParentDepartment_IdAndDeletedFalse(department.getId()).stream()
				.map(this::toTree)
				.toList();
		return new DepartmentTreeResponse(department.getId(), department.getName(), children);
	}

	@Transactional
	public DepartmentResponse createDepartment(DepartmentRequest request) {
		Department parent = resolveParent(request.parentDepartmentId());
		Department department = new Department(request.name(), request.orgType(), parent, request.headcount());
		return DepartmentResponse.from(departmentRepository.save(department));
	}

	@Transactional
	public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
		Department department = findActive(id);
		Department parent = resolveParent(request.parentDepartmentId());
		if (parent != null && parent.getId().equals(id)) {
			throw ApiException.badRequest("상위 조직으로 자기 자신을 지정할 수 없습니다.");
		}
		department.update(request.name(), request.orgType(), parent, request.headcount());
		return DepartmentResponse.from(department);
	}

	@Transactional
	public void deleteDepartment(Long id) {
		Department department = findActive(id);
		if (!departmentRepository.findByParentDepartment_IdAndDeletedFalse(id).isEmpty()) {
			throw ApiException.conflict("하위 조직이 존재하여 삭제할 수 없습니다.");
		}
		department.delete();
	}

	private Department resolveParent(Long parentDepartmentId) {
		return parentDepartmentId == null ? null : findActive(parentDepartmentId);
	}

	private Department findActive(Long id) {
		return departmentRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("조직을 찾을 수 없습니다. id=" + id));
	}
}
