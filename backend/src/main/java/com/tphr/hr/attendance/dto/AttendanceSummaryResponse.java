package com.tphr.hr.attendance.dto;

import java.time.LocalDate;

public record AttendanceSummaryResponse(
		LocalDate workDate,
		long present,
		long late,
		long absent,
		long annualLeave
) {
}
