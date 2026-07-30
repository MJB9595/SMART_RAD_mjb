package com.tphr.hr.attendance;

import com.tphr.hr.attendance.dto.AttendanceRequest;
import com.tphr.hr.attendance.dto.AttendanceResponse;
import com.tphr.hr.attendance.dto.AttendanceSummaryResponse;
import com.tphr.hr.attendance.dto.MonthlyAttendanceResponse;
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

	private final AttendanceRepository attendanceRepository;
	private final EmployeeRepository employeeRepository;

	/**
	 * 일일 근태 목록.
	 *
	 * <p>전체를 볼 수 있는 사람(관리자·인사팀)이 아니면 본인 기록만 돌려준다.
	 * 화면에서 감추는 것으로는 API 를 직접 부르면 남의 근태가 그대로 보이므로 서버에서 자른다.
	 */
	public List<AttendanceResponse> getAttendancesByDate(LocalDate workDate, Long currentEmployeeId, boolean canSeeAll) {
		return attendanceRepository.findByWorkDateAndDeletedFalseOrderByEmployee_EmployeeNumberAsc(workDate).stream()
				.filter(a -> canSeeAll || a.getEmployee().getId().equals(currentEmployeeId))
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

	/** 월 근태 현황 — 직원별 출근/지각/결근/연차 일수 집계. */
	public List<MonthlyAttendanceResponse> getMonthlyAttendance(int year, int month, Long currentEmployeeId,
			boolean canSeeAll) {
		LocalDate start = LocalDate.of(year, month, 1);
		LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

		Map<Long, Employee> employees = new LinkedHashMap<>();
		Map<Long, int[]> counts = new LinkedHashMap<>(); // [present, late, absent, leave]
		// 일자별 상세도 함께 모은다 — 화면 격자가 임의 데이터를 만들지 않도록.
		Map<Long, Map<Integer, MonthlyAttendanceResponse.DailyAttendance>> daily = new LinkedHashMap<>();
		for (Attendance a : attendanceRepository
				.findByWorkDateBetweenAndDeletedFalseOrderByEmployee_EmployeeNumberAscWorkDateAsc(start, end)) {
			Employee e = a.getEmployee();
			if (!canSeeAll && !e.getId().equals(currentEmployeeId)) {
				continue;
			}
			employees.putIfAbsent(e.getId(), e);
			int[] c = counts.computeIfAbsent(e.getId(), k -> new int[4]);
			daily.computeIfAbsent(e.getId(), k -> new LinkedHashMap<>()).put(
					a.getWorkDate().getDayOfMonth(),
					new MonthlyAttendanceResponse.DailyAttendance(
							a.getStatus().name(),
							a.getCheckInTime() != null ? a.getCheckInTime().toString() : null,
							a.getCheckOutTime() != null ? a.getCheckOutTime().toString() : null));
			switch (a.getStatus()) {
				case PRESENT -> c[0]++;
				case LATE -> c[1]++;
				case ABSENT -> c[2]++;
				case ANNUAL_LEAVE -> c[3]++;
			}
		}

		return employees.values().stream().map(e -> {
			int[] c = counts.get(e.getId());
			int total = c[0] + c[1] + c[2] + c[3];
			return new MonthlyAttendanceResponse(e.getId(), e.getEmployeeNumber(), e.getName(),
					e.getDepartment() != null ? e.getDepartment().getName() : null,
					c[0], c[1], c[2], c[3], total,
					daily.getOrDefault(e.getId(), Map.of()));
		}).toList();
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
