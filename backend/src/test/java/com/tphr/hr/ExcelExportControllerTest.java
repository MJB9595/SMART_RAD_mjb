package com.tphr.hr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tphr.hr.common.excel.ExcelExportSupport;
import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

class ExcelExportControllerTest extends IntegrationTestSupport {

	@Autowired
	MockMvc mockMvc;

	@Test
	void 관리자는_월근태_엑셀을_다운로드한다() throws Exception {
		MvcResult result = mockMvc.perform(get("/attendances/monthly/export")
						.param("year", "2026")
						.param("month", "7")
						.with(user("admin").roles("ADMIN")))
				.andExpect(status().isOk())
				.andExpect(header().string(HttpHeaders.CONTENT_TYPE, ExcelExportSupport.XLSX_CONTENT_TYPE))
				.andReturn();

		byte[] file = result.getResponse().getContentAsByteArray();
		try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(file))) {
			assertThat(workbook.getSheet("월 근태 현황")).isNotNull();
			assertThat(workbook.getSheet("일별 근태 기록")).isNotNull();
			assertThat(workbook.getSheet("월 근태 현황").getLastRowNum()).isGreaterThan(1);
		}
		writeQaFile("monthly-attendance.xlsx", file);
	}

	@Test
	void 관리자는_급여대장과_은행전송용_엑셀을_다운로드한다() throws Exception {
		byte[] register = download("/payrolls/export");
		byte[] detail = download("/payrolls/1/export");
		byte[] settlement = download("/payrolls/settlement/export?yearMonth=202607&formType=bank");
		byte[] accounting = download("/payrolls/settlement/export?yearMonth=202607&formType=acc");
		byte[] full = download("/payrolls/settlement/export?yearMonth=202607&formType=full");

		try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(register))) {
			assertThat(workbook.getSheet("급여 대장").getLastRowNum()).isGreaterThan(1);
		}
		try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(settlement))) {
			assertThat(workbook.getSheet("은행 전송용").getRow(2).getCell(3).getStringCellValue()).isNotBlank();
		}
		try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(detail))) {
			assertThat(workbook.getSheet("급여 명세서").getRow(2).getCell(1).getStringCellValue()).isNotBlank();
		}
		try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(accounting))) {
			assertThat(workbook.getSheet("회계 처리용").getLastRowNum()).isGreaterThan(1);
		}
		try (XSSFWorkbook workbook = new XSSFWorkbook(new ByteArrayInputStream(full))) {
			assertThat(workbook.getSheet("전체 급여대장").getLastRowNum()).isGreaterThan(1);
		}
		writeQaFile("payroll-register.xlsx", register);
		writeQaFile("payroll-bank-settlement.xlsx", settlement);
	}

	private byte[] download(String path) throws Exception {
		return mockMvc.perform(get(path).with(user("admin").roles("ADMIN")))
				.andExpect(status().isOk())
				.andExpect(header().string(HttpHeaders.CONTENT_TYPE, ExcelExportSupport.XLSX_CONTENT_TYPE))
				.andReturn()
				.getResponse()
				.getContentAsByteArray();
	}

	private void writeQaFile(String fileName, byte[] file) throws Exception {
		String qaDirectory = System.getenv("EXCEL_QA_DIR");
		if (qaDirectory == null || qaDirectory.isBlank()) {
			return;
		}
		Path directory = Path.of(qaDirectory);
		Files.createDirectories(directory);
		Files.write(directory.resolve(fileName), file);
	}
}
