package com.tphr.hr.attendance.dto;

import java.util.Map;

/** 월 근태 현황 — 직원별 월간 집계 (출근/지각/결근/연차 일수) + 일자별 상세. */
public record MonthlyAttendanceResponse(
		Long employeeId,
		String employeeNumber,
		String employeeName,
		String departmentName,
		int present,
		int late,
		int absent,
		int leave,
		int total,
		/** 일(1~31) → 그 날의 근태. 화면 격자가 임의 데이터를 만들지 않도록 실제 기록을 함께 내려준다. */
		Map<Integer, DailyAttendance> daily
) {

	/** 격자 한 칸에 필요한 정보만. */
	public record DailyAttendance(String status, String checkInTime, String checkOutTime) {
	}
}
