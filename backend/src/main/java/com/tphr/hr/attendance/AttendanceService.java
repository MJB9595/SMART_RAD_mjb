package com.tphr.hr.attendance;

import com.tphr.hr.attendance.dto.AttendanceRequest;
import com.tphr.hr.attendance.dto.AttendanceResponse;
import com.tphr.hr.attendance.dto.AttendanceSummaryResponse;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

	private final AttendanceRepository attendanceRepository;
	private final EmployeeRepository employeeRepository;

	public List<AttendanceResponse> getAttendancesByDate(LocalDate workDate) {
		return attendanceRepository.findByWorkDateAndDeletedFalseOrderByEmployee_EmployeeNumberAsc(workDate).stream()
				.map(AttendanceResponse::from)
				.toList();
	}

	public AttendanceSummaryResponse getSummary(LocalDate workDate) {
		return new AttendanceSummaryResponse(
				workDate,
				attendanceRepository.countByWorkDateAndStatusAndDeletedFalse(workDate, AttendanceStatus.PRESENT),
				attendanceRepository.countByWorkDateAndStatusAndDeletedFalse(workDate, AttendanceStatus.LATE),
				attendanceRepository.countByWorkDateAndStatusAndDeletedFalse(workDate, AttendanceStatus.ABSENT),
				attendanceRepository.countByWorkDateAndStatusAndDeletedFalse(workDate, AttendanceStatus.ANNUAL_LEAVE)
		);
	}

	@Transactional
	public AttendanceResponse register(AttendanceRequest request) {
		Employee employee = employeeRepository.findById(request.employeeId())
				.orElseThrow(() -> ApiException.notFound("사원을 찾을 수 없습니다. id=" + request.employeeId()));

		Attendance attendance = attendanceRepository
				.findByEmployee_IdAndWorkDateAndDeletedFalse(request.employeeId(), request.workDate())
				.orElse(null);

		if (attendance == null) {
			attendance = new Attendance(employee, request.workDate(), request.checkInTime(), request.checkOutTime(),
					request.status());
			attendance = attendanceRepository.save(attendance);
		} else {
			attendance.update(request.checkInTime(), request.checkOutTime(), request.status());
		}

		return AttendanceResponse.from(attendance);
	}

	@Transactional
	public List<AttendanceResponse> registerBulk(List<AttendanceRequest> requests) {
		return requests.stream()
				.map(this::register)
				.toList();
	}

	@Transactional
	public void deleteAttendance(Long id) {
		Attendance attendance = attendanceRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("근태 기록을 찾을 수 없습니다. id=" + id));
		attendance.delete();
	}
}
