package com.tphr.hr.attendance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.tphr.hr.department.Department;
import com.tphr.hr.employee.Employee;
import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AttendanceExcelServiceTest {

	@Mock
	AttendanceRepository attendanceRepository;

	@InjectMocks
	AttendanceExcelService attendanceExcelService;

	@Test
	void 월근태_집계와_일별기록을_엑셀로_생성한다() throws Exception {
		Attendance attendance = org.mockito.Mockito.mock(Attendance.class);
		Employee employee = org.mockito.Mockito.mock(Employee.class);
		Department department = org.mockito.Mockito.mock(Department.class);
		when(attendance.getEmployee()).thenReturn(employee);
		when(attendance.getWorkDate()).thenReturn(LocalDate.of(2026, 7, 1));
		when(attendance.getCheckInTime()).thenReturn(LocalTime.of(9, 5));
		when(attendance.getCheckOutTime()).thenReturn(LocalTime.of(18, 0));
		when(attendance.getStatus()).thenReturn(AttendanceStatus.LATE);
		when(employee.getId()).thenReturn(2L);
		when(employee.getEmployeeNumber()).thenReturn("FAC001");
		when(employee.getName()).thenReturn("김정교");
		when(employee.getDepartment()).thenReturn(department);
		when(department.getName()).thenReturn("컴퓨터공학과");
		when(attendanceRepository.findByWorkDateBetweenAndDeletedFalseOrderByEmployee_EmployeeNumberAscWorkDateAsc(
				LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 31)))
				.thenReturn(List.of(attendance));

		byte[] result = attendanceExcelService.exportMonthly(2026, 7);

		try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(result))) {
			assertThat(workbook.getNumberOfSheets()).isEqualTo(2);
			assertThat(workbook.getSheet("월 근태 현황").getRow(2).getCell(0).getStringCellValue())
					.isEqualTo("FAC001");
			assertThat(workbook.getSheet("월 근태 현황").getRow(2).getCell(4).getNumericCellValue())
					.isEqualTo(1);
			assertThat(workbook.getSheet("일별 근태 기록").getRow(2).getCell(7).getStringCellValue())
					.isEqualTo("지각");
		}
	}
}
