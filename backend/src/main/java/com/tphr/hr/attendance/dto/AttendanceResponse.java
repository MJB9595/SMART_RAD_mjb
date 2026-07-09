package com.tphr.hr.attendance.dto;

import com.tphr.hr.attendance.Attendance;
import com.tphr.hr.attendance.AttendanceStatus;
import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceResponse(
		Long id,
		Long employeeId,
		String employeeNumber,
		String employeeName,
		LocalDate workDate,
		LocalTime checkInTime,
		LocalTime checkOutTime,
		AttendanceStatus status
) {

	public static AttendanceResponse from(Attendance attendance) {
		return new AttendanceResponse(
				attendance.getId(),
				attendance.getEmployee().getId(),
				attendance.getEmployee().getEmployeeNumber(),
				attendance.getEmployee().getName(),
				attendance.getWorkDate(),
				attendance.getCheckInTime(),
				attendance.getCheckOutTime(),
				attendance.getStatus()
		);
	}
}
