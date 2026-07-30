package com.tphr.hr.employee.dto;

import com.tphr.hr.employee.Employee;

/**
 * 근태·휴가·경조비 등에서 "대상 교직원"으로 고를 수 있는 사람 한 명.
 *
 * <p>목록 전체를 주는 /employees 는 ADMIN·HR 전용이라 일반 직원은 403 을 받아 선택 상자가 비어 있었다.
 * 이 응답은 선택에 필요한 최소 정보만 담아 모든 로그인 사용자에게 열어 주고, 대신 보이는 범위를
 * 서버가 역할에 따라 좁힌다.
 */
public record SelectableEmployeeResponse(
		Long id,
		String employeeNumber,
		String name,
		String departmentName,
		String positionName,
		/** 로그인한 본인인지 — 화면에서 기본 선택·하이라이트에 쓴다. */
		boolean self
) {

	public static SelectableEmployeeResponse from(Employee e, Long currentEmployeeId) {
		return new SelectableEmployeeResponse(
				e.getId(),
				e.getEmployeeNumber(),
				e.getName(),
				e.getDepartment() != null ? e.getDepartment().getName() : null,
				e.getPosition() != null ? e.getPosition().getName() : null,
				e.getId().equals(currentEmployeeId));
	}
}
