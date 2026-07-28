package com.tphr.hr.attendance;

import static com.tphr.hr.common.excel.ExcelExportSupport.finishSheet;
import static com.tphr.hr.common.excel.ExcelExportSupport.setNumber;
import static com.tphr.hr.common.excel.ExcelExportSupport.setText;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.common.excel.ExcelExportSupport;
import com.tphr.hr.common.excel.ExcelExportSupport.Styles;
import com.tphr.hr.employee.Employee;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceExcelService {

	private static final String[] SUMMARY_HEADERS = {
			"사번", "성명", "소속", "출근", "지각", "결근", "연차", "합계"
	};
	private static final String[] DETAIL_HEADERS = {
			"근무일", "요일", "사번", "성명", "소속", "출근시각", "퇴근시각", "근태상태"
	};

	private final AttendanceRepository attendanceRepository;

	public byte[] exportMonthly(int year, int month) {
		YearMonth yearMonth = parseYearMonth(year, month);
		LocalDate start = yearMonth.atDay(1);
		List<Attendance> attendances = attendanceRepository
				.findByWorkDateBetweenAndDeletedFalseOrderByEmployee_EmployeeNumberAscWorkDateAsc(
						start, yearMonth.atEndOfMonth());

		try (XSSFWorkbook workbook = new XSSFWorkbook()) {
			Styles styles = ExcelExportSupport.createStyles(workbook);
			writeSummarySheet(workbook, styles, yearMonth, attendances);
			writeDetailSheet(workbook, styles, yearMonth, attendances);
			return ExcelExportSupport.toBytes(workbook);
		} catch (Exception exception) {
			if (exception instanceof ApiException apiException) {
				throw apiException;
			}
			throw new IllegalStateException("월 근태 엑셀 생성에 실패했습니다.", exception);
		}
	}

	private void writeSummarySheet(XSSFWorkbook workbook, Styles styles, YearMonth yearMonth,
			List<Attendance> attendances) {
		Sheet sheet = ExcelExportSupport.createSheet(workbook, "월 근태 현황",
				yearMonth.getYear() + "년 " + yearMonth.getMonthValue() + "월 근태 현황",
				SUMMARY_HEADERS, styles);

		Map<Long, AttendanceCounts> summaries = new LinkedHashMap<>();
		for (Attendance attendance : attendances) {
			Employee employee = attendance.getEmployee();
			AttendanceCounts counts = summaries.computeIfAbsent(employee.getId(), ignored -> new AttendanceCounts(employee));
			counts.add(attendance.getStatus());
		}

		int rowIndex = 2;
		for (AttendanceCounts counts : summaries.values()) {
			Row row = sheet.createRow(rowIndex++);
			setText(row, 0, counts.employee.getEmployeeNumber(), styles.center());
			setText(row, 1, counts.employee.getName(), styles.text());
			setText(row, 2, counts.employee.getDepartment().getName(), styles.text());
			setNumber(row, 3, counts.present, styles.integer());
			setNumber(row, 4, counts.late, styles.integer());
			setNumber(row, 5, counts.absent, styles.integer());
			setNumber(row, 6, counts.leave, styles.integer());
			Cell total = row.createCell(7);
			total.setCellFormula("SUM(D" + rowIndex + ":G" + rowIndex + ")");
			total.setCellStyle(styles.integer());
		}
		if (summaries.isEmpty()) {
			setText(sheet.createRow(rowIndex++), 0, "해당 월의 근태 기록이 없습니다.", styles.text());
		}
		finishSheet(sheet, rowIndex - 1, new int[]{14, 14, 22, 10, 10, 10, 10, 10});
	}

	private void writeDetailSheet(XSSFWorkbook workbook, Styles styles, YearMonth yearMonth,
			List<Attendance> attendances) {
		Sheet sheet = ExcelExportSupport.createSheet(workbook, "일별 근태 기록",
				yearMonth.getYear() + "년 " + yearMonth.getMonthValue() + "월 일별 근태 기록",
				DETAIL_HEADERS, styles);

		int rowIndex = 2;
		for (Attendance attendance : attendances) {
			Employee employee = attendance.getEmployee();
			Row row = sheet.createRow(rowIndex++);
			Cell workDate = row.createCell(0);
			workDate.setCellValue(attendance.getWorkDate());
			workDate.setCellStyle(styles.date());
			setText(row, 1, attendance.getWorkDate().getDayOfWeek()
					.getDisplayName(TextStyle.SHORT, Locale.KOREAN), styles.center());
			setText(row, 2, employee.getEmployeeNumber(), styles.center());
			setText(row, 3, employee.getName(), styles.text());
			setText(row, 4, employee.getDepartment().getName(), styles.text());
			setText(row, 5, attendance.getCheckInTime() == null ? "" : attendance.getCheckInTime().toString(),
					styles.center());
			setText(row, 6, attendance.getCheckOutTime() == null ? "" : attendance.getCheckOutTime().toString(),
					styles.center());
			setText(row, 7, statusLabel(attendance.getStatus()), styles.center());
		}
		if (attendances.isEmpty()) {
			setText(sheet.createRow(rowIndex++), 0, "해당 월의 근태 기록이 없습니다.", styles.text());
		}
		finishSheet(sheet, rowIndex - 1, new int[]{14, 10, 14, 14, 22, 12, 12, 14});
	}

	private YearMonth parseYearMonth(int year, int month) {
		try {
			return YearMonth.of(year, month);
		} catch (DateTimeException exception) {
			throw ApiException.badRequest("유효한 연도와 월을 입력해 주세요.");
		}
	}

	private String statusLabel(AttendanceStatus status) {
		return switch (status) {
			case PRESENT -> "출근";
			case LATE -> "지각";
			case ABSENT -> "결근";
			case ANNUAL_LEAVE -> "연차";
		};
	}

	private static final class AttendanceCounts {
		private final Employee employee;
		private int present;
		private int late;
		private int absent;
		private int leave;

		private AttendanceCounts(Employee employee) {
			this.employee = employee;
		}

		private void add(AttendanceStatus status) {
			switch (status) {
				case PRESENT -> present++;
				case LATE -> late++;
				case ABSENT -> absent++;
				case ANNUAL_LEAVE -> leave++;
			}
		}
	}
}
