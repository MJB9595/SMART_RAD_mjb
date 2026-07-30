package com.tphr.hr.attendance;

import com.tphr.hr.attendance.dto.AttendanceRequest;
import com.tphr.hr.attendance.dto.AttendanceResponse;
import com.tphr.hr.attendance.dto.AttendanceSummaryResponse;
import com.tphr.hr.attendance.dto.MonthlyAttendanceResponse;
import com.tphr.hr.common.excel.ExcelExportSupport;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.tphr.hr.security.CustomUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/attendances")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class AttendanceController {

	private final AttendanceService attendanceService;
	private final AttendanceExcelService attendanceExcelService;

	@GetMapping
	public List<AttendanceResponse> getAttendancesByDate(
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate,
			@AuthenticationPrincipal CustomUserDetails userDetails) {
		return attendanceService.getAttendancesByDate(workDate, userDetails.getEmployeeId(), canSeeAll(userDetails));
	}

	@GetMapping("/summary")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('LEAVE_APPROVE')")
	public AttendanceSummaryResponse getSummary(
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate) {
		return attendanceService.getSummary(workDate);
	}

	/** 월 근태 현황 — 직원별 월간 집계. */
	@GetMapping("/monthly")
	public List<MonthlyAttendanceResponse> getMonthly(@RequestParam int year, @RequestParam int month,
			@AuthenticationPrincipal CustomUserDetails userDetails) {
		return attendanceService.getMonthlyAttendance(year, month, userDetails.getEmployeeId(), canSeeAll(userDetails));
	}

	@GetMapping("/monthly/export")
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('LEAVE_APPROVE')")
	public ResponseEntity<byte[]> exportMonthly(@RequestParam int year, @RequestParam int month) {
		byte[] file = attendanceExcelService.exportMonthly(year, month);
		String fileName = "%d년_%02d월_근태현황.xlsx".formatted(year, month);
		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(ExcelExportSupport.XLSX_CONTENT_TYPE))
				.header(HttpHeaders.CONTENT_DISPOSITION, ExcelExportSupport.contentDisposition(fileName))
				.contentLength(file.length)
				.body(file);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('LEAVE_APPROVE')")
	public AttendanceResponse register(@Valid @RequestBody AttendanceRequest request) {
		return attendanceService.register(request);
	}

	@PostMapping("/bulk")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('LEAVE_APPROVE')")
	public List<AttendanceResponse> registerBulk(@Valid @RequestBody List<AttendanceRequest> requests) {
		return attendanceService.registerBulk(requests);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN') or hasAuthority('LEAVE_APPROVE')")
	public void deleteAttendance(@PathVariable Long id) {
		attendanceService.deleteAttendance(id);
	}

	/** 전체 근태를 볼 수 있는 사람인지 — 관리자이거나 근태·휴가 승인 권한자. */
	private boolean canSeeAll(CustomUserDetails userDetails) {
		return userDetails.getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("LEAVE_APPROVE"));
	}
}
