package com.tphr.hr.system;

import com.tphr.hr.system.dto.AuditLogResponse;
import com.tphr.hr.system.dto.CommonCodeRequest;
import com.tphr.hr.system.dto.CommonCodeResponse;
import com.tphr.hr.system.dto.PermissionResponse;
import com.tphr.hr.system.dto.RoleRequest;
import com.tphr.hr.system.dto.RoleResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
@RequestMapping("/system")
@RequiredArgsConstructor
public class SystemController {

	private final SystemService systemService;
	private final AuditLogService auditLogService;

	// ===== 공통 코드 관리 =====
	@GetMapping("/common-codes")
	public List<CommonCodeResponse> getCommonCodes() {
		return systemService.getCommonCodes();
	}

	@PostMapping("/common-codes")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public CommonCodeResponse createCommonCode(@Valid @RequestBody CommonCodeRequest request) {
		return systemService.createCommonCode(request);
	}

	@PutMapping("/common-codes/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public CommonCodeResponse updateCommonCode(@PathVariable Long id, @Valid @RequestBody CommonCodeRequest request) {
		return systemService.updateCommonCode(id, request);
	}

	@DeleteMapping("/common-codes/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteCommonCode(@PathVariable Long id) {
		systemService.deleteCommonCode(id);
	}

	// ===== 권한 관리 (RBAC) =====
	@GetMapping("/roles")
	@PreAuthorize("hasRole('ADMIN')")
	public List<RoleResponse> getRoles() {
		return systemService.getRoles();
	}

	/** 역할에 부여할 수 있는 전체 권한 목록 (권한 편집 화면용). */
	@GetMapping("/permissions")
	@PreAuthorize("hasRole('ADMIN')")
	public List<PermissionResponse> getPermissions() {
		return systemService.getPermissions();
	}

	@PostMapping("/roles")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public RoleResponse createRole(@Valid @RequestBody RoleRequest request) {
		return systemService.createRole(request);
	}

	@PutMapping("/roles/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public RoleResponse updateRole(@PathVariable Long id, @Valid @RequestBody RoleRequest request) {
		return systemService.updateRole(id, request);
	}

	/** 역할 활성/비활성 전환. */
	@PatchMapping("/roles/{id}/active")
	@PreAuthorize("hasRole('ADMIN')")
	public RoleResponse setRoleActive(@PathVariable Long id, @RequestParam boolean active) {
		return systemService.setRoleActive(id, active);
	}

	@DeleteMapping("/roles/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void deleteRole(@PathVariable Long id) {
		systemService.deleteRole(id);
	}

	// ===== 감사로그 조회 =====
	@GetMapping("/audit-logs")
	@PreAuthorize("hasRole('ADMIN')")
	public Page<AuditLogResponse> getAuditLogs(
			@PageableDefault(size = 30) Pageable pageable) {
		return auditLogService.getAuditLogs(pageable);
	}
}
