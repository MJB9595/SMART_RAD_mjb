package com.tphr.hr.records.dto;

/**
 * 인사기록카드 미리보기/통계용 요약. 학력·경력·자격 목록을 집계한 대표값을 담는다.
 */
public record EmployeeRecordSummary(
		Long employeeId,
		String latestEducation,
		String topCertification,
		int educationCount,
		int careerCount,
		int certificationCount,
		Integer yearsOfService,
		long expiringCertificationCount
) {
}
