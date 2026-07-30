package com.tphr.hr.employee.dto;

/**
 * 교직원 정보관리 상단 요약 카드 값.
 *
 * <p>지금까지 이 카드는 화면에서 0 으로 초기화한 뒤 아무도 채우지 않아 항상 0 이었다.
 * 전체를 볼 수 없는 사용자에게는 본인 기준 값만 내려준다.
 */
public record EmployeeStatsResponse(
		long total,
		long employed,
		long onLeave,
		/** 90일 안에 만료되는 자격증 건수. */
		long expiring
) {
}
