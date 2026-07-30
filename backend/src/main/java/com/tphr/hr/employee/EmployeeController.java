package com.tphr.hr.employee;

import com.tphr.hr.common.StaffCategory;
import com.tphr.hr.employee.dto.EmployeeCreateRequest;
import com.tphr.hr.employee.dto.EmployeeResponse;
import com.tphr.hr.employee.dto.EmployeeStatusRequest;
import com.tphr.hr.employee.dto.EmployeeUpdateRequest;
import com.tphr.hr.employee.dto.PasswordChangeRequest;
import com.tphr.hr.employee.dto.SelfPasswordChangeRequest;
import com.tphr.hr.security.SecurityUtils;
import com.tphr.hr.signup.SignupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import com.tphr.hr.employee.dto.SelectableEmployeeResponse;
import com.tphr.hr.security.CustomUserDetails;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
	private final SignupService signupService;

	/**
	 * 선택 상자용 대상 교직원 목록. 전체 목록(/employees)은 ADMIN·HR 전용이라 일반 직원이 403 을 받아
	 * 선택 상자가 비어 있었다. 여기서는 모든 로그인 사용자를 받되 보이는 범위를 서버가 좁힌다.
	 */
	@GetMapping("/selectable")
	@PreAuthorize("isAuthenticated()")
	public List<SelectableEmployeeResponse> getSelectableEmployees(
			@AuthenticationPrincipal CustomUserDetails userDetails) {
		return employeeService.getSelectableEmployees(userDetails.getEmployeeId());
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_READ')")
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
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_READ') or #id == authentication.principal.employeeId")
	public EmployeeResponse getEmployee(@PathVariable Long id) {
		return employeeService.getEmployee(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_WRITE')")
	public EmployeeResponse createEmployee(@Valid @RequestBody EmployeeCreateRequest request) {
		return employeeService.createEmployee(request);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_WRITE')")
	public EmployeeResponse updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeUpdateRequest request) {
		return employeeService.updateEmployee(id, request);
	}

	@PatchMapping("/{id}/status")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('EMPLOYEE_WRITE')")
	public EmployeeResponse changeEmploymentStatus(@PathVariable Long id,
			@Valid @RequestBody EmployeeStatusRequest request) {
		return employeeService.changeEmploymentStatus(id, request);
	}

	/** 본인 비밀번호 변경 (인증된 직원 누구나 · 현재 비번 검증). ADMIN 리셋과 별도 경로. */
	@PatchMapping("/me/password")
	@PreAuthorize("isAuthenticated()")
	public void changeOwnPassword(@Valid @RequestBody SelfPasswordChangeRequest request) {
		employeeService.changeOwnPassword(SecurityUtils.getCurrentEmployeeId(), request);
	}

	@PatchMapping("/{id}/password")
	@PreAuthorize("hasRole('ADMIN')")  // 계정 탈취·오조작 위험이 커 일반 WRITE 권한으로는 열지 않는다
	public void changePassword(@PathVariable Long id, @Valid @RequestBody PasswordChangeRequest request) {
		employeeService.changePassword(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")  // 계정 탈취·오조작 위험이 커 일반 WRITE 권한으로는 열지 않는다
	public void deleteEmployee(@PathVariable Long id) {
		employeeService.deleteEmployee(id);
	}

	/**
	 * 매치 해제 — 잘못 매칭 승인된 계정을 되돌린다.
	 * 자리를 다시 OPEN, 회원가입 신청을 승인 대기큐로 복귀시키고 이 계정을 삭제한다.
	 */
	@PostMapping("/{id}/unmatch")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")  // 계정 탈취·오조작 위험이 커 일반 WRITE 권한으로는 열지 않는다
	public void unmatch(@PathVariable Long id) {
		signupService.unmatch(id);
	}
}
