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
		return DepartmentResponse.from(findActiveDepartment(id));
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
		Department department = new Department(request.name(), parent);
		return DepartmentResponse.from(departmentRepository.save(department));
	}

	@Transactional
	public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
		Department department = findActiveDepartment(id);
		Department parent = resolveParent(request.parentDepartmentId());
		if (parent != null && parent.getId().equals(id)) {
			throw ApiException.badRequest("상위 부서로 자기 자신을 지정할 수 없습니다.");
		}
		department.update(request.name(), parent);
		return DepartmentResponse.from(department);
	}

	@Transactional
	public void deleteDepartment(Long id) {
		Department department = findActiveDepartment(id);
		if (!departmentRepository.findByParentDepartment_IdAndDeletedFalse(id).isEmpty()) {
			throw ApiException.conflict("하위 부서가 존재하여 삭제할 수 없습니다.");
		}
		department.delete();
	}

	private Department resolveParent(Long parentDepartmentId) {
		if (parentDepartmentId == null) {
			return null;
		}
		return findActiveDepartment(parentDepartmentId);
	}

	private Department findActiveDepartment(Long id) {
		Department department = departmentRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("부서를 찾을 수 없습니다. id=" + id));
		if (department.isDeleted()) {
			throw ApiException.notFound("부서를 찾을 수 없습니다. id=" + id);
		}
		return department;
	}
}
