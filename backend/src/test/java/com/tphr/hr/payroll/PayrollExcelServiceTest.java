package com.tphr.hr.payroll;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.tphr.hr.employee.Employee;
import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class PayrollExcelServiceTest {

	@Mock
	PayrollRepository payrollRepository;

	@InjectMocks
	PayrollExcelService payrollExcelService;

	private Payroll payroll;

	@BeforeEach
	void setUp() {
		payroll = org.mockito.Mockito.mock(Payroll.class);
		Employee employee = org.mockito.Mockito.mock(Employee.class);
		when(payroll.getEmployee()).thenReturn(employee);
		when(payroll.getPayrollYearMonth()).thenReturn("202607");
		when(payroll.getPaymentDate()).thenReturn(LocalDate.of(2026, 7, 25));
		when(payroll.getTotalPayAmount()).thenReturn(new BigDecimal("5650000"));
		when(payroll.getTotalDeductionAmount()).thenReturn(new BigDecimal("565000"));
		when(payroll.getRealPayAmount()).thenReturn(new BigDecimal("5085000"));
		when(payroll.getPayrollStatusCode()).thenReturn("CONFIRMED");
		when(payroll.getDepartmentNameSnapshot()).thenReturn("컴퓨터공학과");
		when(payroll.getPositionNameSnapshot()).thenReturn("교수");
		when(employee.getEmployeeNumber()).thenReturn("FAC001");
		when(employee.getName()).thenReturn("김정교");
		when(employee.getBankName()).thenReturn("국민은행");
		when(employee.getAccountNumber()).thenReturn("123456-01-000001");
		when(employee.getAccountHolder()).thenReturn("김정교");
	}

	@Test
	void 급여대장을_엑셀로_생성한다() throws Exception {
		when(payrollRepository.findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc())
				.thenReturn(List.of(payroll));

		byte[] result = payrollExcelService.exportAll();

		try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(result))) {
			assertThat(workbook.getSheet("급여 대장").getRow(2).getCell(0).getStringCellValue())
					.isEqualTo("2026-07");
			assertThat(workbook.getSheet("급여 대장").getRow(2).getCell(8).getNumericCellValue())
					.isEqualTo(5085000);
		}
	}

	@Test
	void 확정급여를_은행전송용_엑셀로_생성한다() throws Exception {
		when(payrollRepository.findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc())
				.thenReturn(List.of(payroll));

		byte[] result = payrollExcelService.exportSettlement("202607", "bank");

		try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(result))) {
			assertThat(workbook.getSheet("은행 전송용").getRow(2).getCell(3).getStringCellValue())
					.isEqualTo("123456-01-000001");
			assertThat(workbook.getSheet("은행 전송용").getRow(2).getCell(5).getNumericCellValue())
					.isEqualTo(5085000);
		}
	}
}
