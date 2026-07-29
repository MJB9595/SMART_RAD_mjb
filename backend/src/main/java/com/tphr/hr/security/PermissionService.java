package com.tphr.hr.security;

import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.welfare.repository.EmployeeCertificateIssueRepository;
import com.tphr.hr.welfare.repository.EmployeeEventSupportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("permissionService")
@RequiredArgsConstructor
public class PermissionService {

	private final EmployeeRepository employeeRepository;
	private final EmployeeCertificateIssueRepository certificateIssueRepository;
	private final EmployeeEventSupportRepository eventSupportRepository;

	/**
	 * 시스템 관리자이거나 인사팀인지 확인.
	 */
	public boolean isAdminOrHr(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()) return false;
		return authentication.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_HR"));
	}

	/**
	 * 특정 대상 교직원(targetEmployeeId)에 대한 승인 권한이 있는지 확인.
	 * 규칙: ADMIN/HR은 무조건 승인 가능.
	 * 그 외: 같은 부서이면서 직급 레벨(숫자)이 더 작은(높은) 경우에만 승인 가능.
	 */
	@Transactional(readOnly = true)
	public boolean canApproveTarget(Authentication authentication, Long targetEmployeeId) {
		if (isAdminOrHr(authentication)) {
			return true;
		}

		if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
			Employee current = userDetails.getEmployee();
			Employee target = employeeRepository.findById(targetEmployeeId).orElse(null);

			if (target == null) return false;

			// 본인 승인 불가
			if (current.getId().equals(target.getId())) {
				return false;
			}

			// 부서 검증
			if (current.getDepartment() == null || target.getDepartment() == null) {
				return false;
			}
			if (!current.getDepartment().getId().equals(target.getDepartment().getId())) {
				return false;
			}

			// 직급 검증 (숫자가 작을수록 높음)
			if (current.getPosition() == null || target.getPosition() == null) {
				return false;
			}
			return current.getPosition().getSortOrder() < target.getPosition().getSortOrder();
		}

		return false;
	}

	@Transactional(readOnly = true)
	public boolean canApproveCertificate(Authentication authentication, Long certificateId) {
		if (isAdminOrHr(authentication)) return true;
		var certOpt = certificateIssueRepository.findById(certificateId);
		if (certOpt.isEmpty()) return false;
		return canApproveTarget(authentication, certOpt.get().getEmployee().getId());
	}

	@Transactional(readOnly = true)
	public boolean canApproveEventSupport(Authentication authentication, Long eventSupportId) {
		if (isAdminOrHr(authentication)) return true;
		var eventOpt = eventSupportRepository.findById(eventSupportId);
		if (eventOpt.isEmpty()) return false;
		return canApproveTarget(authentication, eventOpt.get().getEmployee().getId());
	}
}
