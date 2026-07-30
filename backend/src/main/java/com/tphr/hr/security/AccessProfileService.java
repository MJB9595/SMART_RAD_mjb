package com.tphr.hr.security;

import com.tphr.hr.employee.Employee;
import com.tphr.hr.system.RoleRepository;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** employee_role/role/permission 을 읽어 이 계정이 실제로 갖는 역할·권한을 계산한다. */
@Service
@RequiredArgsConstructor
public class AccessProfileService {

	private final RoleRepository roleRepository;

	@Transactional(readOnly = true)
	public AccessProfile resolve(Employee employee) {
		Long employeeId = employee.getId();
		long assigned = roleRepository.countRolesOfEmployee(employeeId);

		if (assigned == 0) {
			// RBAC 미배정 계정(예: 백필 이전에 만들어진 계정)은 열거값으로 최소 권한만 준다.
			// 배정이 없는 것과 '전부 비활성'은 다르므로 차단하지 않는다 — 차단하면 신규 계정이 못 들어온다.
			return new AccessProfile(List.of("ROLE_" + employee.getRole().name()), Set.of(), false);
		}

		List<String> activeRoles = roleRepository.findActiveRoleCodesOfEmployee(employeeId);
		if (activeRoles.isEmpty()) {
			// 역할을 받긴 했는데 전부 비활성 → 관리자가 의도적으로 막은 상태.
			return AccessProfile.denied();
		}

		return new AccessProfile(
				activeRoles,
				new LinkedHashSet<>(roleRepository.findActivePermissionCodesOfEmployee(employeeId)),
				false);
	}
}
