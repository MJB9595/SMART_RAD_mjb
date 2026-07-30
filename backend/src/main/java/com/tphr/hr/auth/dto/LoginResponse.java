package com.tphr.hr.auth.dto;

import com.tphr.hr.employee.EmployeeRole;
import java.util.List;

public record LoginResponse(
		String accessToken,
		String tokenType,
		Long employeeId,
		String employeeNumber,
		String name,
		String email,
		EmployeeRole role,
		Integer positionLevel,
		Long departmentId,
		String departmentName,
		/** 활성 역할로부터 계산된 권한 코드. 프론트는 이걸로 메뉴·버튼 노출을 판단한다. */
		List<String> permissions
) {

	public static LoginResponse of(String accessToken, Long employeeId, String employeeNumber, String name,
			String email, EmployeeRole role, Integer positionLevel, Long departmentId, String departmentName,
			List<String> permissions) {
		return new LoginResponse(accessToken, "Bearer", employeeId, employeeNumber, name, email, role, positionLevel,
				departmentId, departmentName, permissions);
	}
}
