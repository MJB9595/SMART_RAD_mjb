package com.tphr.hr.system;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.system.dto.CommonCodeRequest;
import com.tphr.hr.system.dto.CommonCodeResponse;
import com.tphr.hr.system.dto.PermissionResponse;
import com.tphr.hr.system.dto.RoleRequest;
import com.tphr.hr.system.dto.RoleResponse;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SystemService {

	private final CommonCodeRepository commonCodeRepository;
	private final RoleRepository roleRepository;
	private final PermissionRepository permissionRepository;
	private final AuditLogService auditLogService;

	// ===== 공통 코드 =====
	public List<CommonCodeResponse> getCommonCodes() {
		return commonCodeRepository.findByDeletedFalseOrderByGroupCodeAscSortOrderAsc().stream()
				.map(CommonCodeResponse::from)
				.toList();
	}

	@Transactional
	public CommonCodeResponse createCommonCode(CommonCodeRequest request) {
		if (commonCodeRepository.existsByGroupCodeAndCodeAndDeletedFalse(request.groupCode(), request.code())) {
			throw ApiException.conflict("이미 존재하는 코드입니다: " + request.groupCode() + "/" + request.code());
		}
		CommonCode code = new CommonCode(request.groupCode(), request.code(), request.name(), request.sortOrder(),
				request.parentCode());
		commonCodeRepository.save(code);
		auditLogService.record("CREATE", "COMMON_CODE", code.getId());
		return CommonCodeResponse.from(code);
	}

	@Transactional
	public CommonCodeResponse updateCommonCode(Long id, CommonCodeRequest request) {
		CommonCode code = commonCodeRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("공통코드를 찾을 수 없습니다. id=" + id));
		code.update(request.name(), request.sortOrder(), request.parentCode());
		auditLogService.record("UPDATE", "COMMON_CODE", code.getId());
		return CommonCodeResponse.from(code);
	}

	@Transactional
	public void deleteCommonCode(Long id) {
		commonCodeRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("공통코드를 찾을 수 없습니다. id=" + id))
				.delete();
		auditLogService.record("DELETE", "COMMON_CODE", id);
	}

	// ===== 권한 (RBAC) =====

	/** 최고 관리자 역할은 잠금 — 스스로 권한을 잃어 시스템에 못 들어가는 사고를 막는다. */
	private static final String PROTECTED_ROLE_CODE = "ROLE_ADMIN";

	public List<RoleResponse> getRoles() {
		return roleRepository.findByDeletedFalseOrderByCodeAsc().stream()
				.map(RoleResponse::from)
				.toList();
	}

	/** 역할에 부여할 수 있는 전체 권한 목록. */
	public List<PermissionResponse> getPermissions() {
		return permissionRepository.findAllByOrderByCodeAsc().stream()
				.map(PermissionResponse::from)
				.toList();
	}

	@Transactional
	public RoleResponse createRole(RoleRequest request) {
		if (roleRepository.existsByCodeAndDeletedFalse(request.code())) {
			throw ApiException.conflict("이미 존재하는 역할 코드입니다: " + request.code());
		}
		Role role = Role.create(request.code(), request.name(), request.description());
		role.replacePermissions(resolvePermissions(request.permissionCodes()));
		roleRepository.save(role);
		auditLogService.record("CREATE", "ROLE", role.getId());
		return RoleResponse.from(role);
	}

	@Transactional
	public RoleResponse updateRole(Long id, RoleRequest request) {
		Role role = findRole(id);
		ensureNotProtected(role, "수정");
		role.update(request.name(), request.description());
		role.replacePermissions(resolvePermissions(request.permissionCodes()));
		auditLogService.record("UPDATE", "ROLE", role.getId());
		return RoleResponse.from(role);
	}

	/** 활성/비활성 전환. 비활성 역할은 권한 판정에서 제외된다. */
	@Transactional
	public RoleResponse setRoleActive(Long id, boolean active) {
		Role role = findRole(id);
		if (!active) {
			ensureNotProtected(role, "비활성화");
		}
		if (active) {
			role.activate();
		} else {
			role.deactivate();
		}
		auditLogService.record(active ? "ACTIVATE" : "DEACTIVATE", "ROLE", role.getId());
		return RoleResponse.from(role);
	}

	@Transactional
	public void deleteRole(Long id) {
		Role role = findRole(id);
		ensureNotProtected(role, "삭제");
		if (roleRepository.countEmployeesUsingRole(id) > 0) {
			throw ApiException.conflict("이 역할을 사용 중인 교직원이 있어 삭제할 수 없습니다. 먼저 역할을 변경하세요.");
		}
		role.delete();
		auditLogService.record("DELETE", "ROLE", id);
	}

	private Role findRole(Long id) {
		return roleRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("역할을 찾을 수 없습니다. id=" + id));
	}

	private void ensureNotProtected(Role role, String action) {
		if (PROTECTED_ROLE_CODE.equals(role.getCode())) {
			throw ApiException.badRequest("최고 관리자 역할(" + PROTECTED_ROLE_CODE + ")은 " + action + "할 수 없습니다.");
		}
	}

	private Set<Permission> resolvePermissions(Set<String> codes) {
		if (codes == null || codes.isEmpty()) {
			return Set.of();
		}
		List<Permission> found = permissionRepository.findByCodeIn(codes);
		if (found.size() != codes.size()) {
			Set<String> foundCodes = found.stream().map(Permission::getCode).collect(Collectors.toSet());
			String missing = codes.stream().filter(c -> !foundCodes.contains(c)).collect(Collectors.joining(", "));
			throw ApiException.badRequest("존재하지 않는 권한 코드입니다: " + missing);
		}
		return new HashSet<>(found);
	}
}
