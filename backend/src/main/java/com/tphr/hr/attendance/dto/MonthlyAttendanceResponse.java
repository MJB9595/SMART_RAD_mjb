package com.tphr.hr.attendance.dto;

/** 월 근태 현황 — 직원별 월간 집계 (출근/지각/결근/연차 일수). */
public record MonthlyAttendanceResponse(
		Long employeeId,
		String employeeNumber,
		String employeeName,
		String departmentName,
		int present,
		int late,
		int absent,
		int leave,
		int total
) {
}
