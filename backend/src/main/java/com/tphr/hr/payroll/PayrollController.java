package com.tphr.hr.payroll;

import com.tphr.hr.payroll.dto.PayrollResponse;
import com.tphr.hr.common.excel.ExcelExportSupport;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payrolls")
@RequiredArgsConstructor
@Transactional(readOnly = true)
@PreAuthorize("hasRole('ADMIN') or hasAuthority('PAYROLL_READ')")
public class PayrollController {

	private final PayrollRepository payrollRepository;
	private final PayrollExcelService payrollExcelService;

	@GetMapping
	public List<PayrollResponse> getPayrolls() {
		return payrollRepository.findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc().stream()
				.map(PayrollResponse::from)
				.toList();
	}

	@GetMapping("/export")
	public ResponseEntity<byte[]> exportPayrolls() {
		return excelResponse(payrollExcelService.exportAll(), "급여대장.xlsx");
	}

	@GetMapping("/{id}/export")
	public ResponseEntity<byte[]> exportPayroll(@PathVariable Long id) {
		return excelResponse(payrollExcelService.exportOne(id), "급여명세서_" + id + ".xlsx");
	}

	@GetMapping("/settlement/export")
	public ResponseEntity<byte[]> exportSettlement(
			@RequestParam String yearMonth,
			@RequestParam String formType) {
		String fileName = "급여정산_" + yearMonth + "_" + formType + ".xlsx";
		return excelResponse(payrollExcelService.exportSettlement(yearMonth, formType), fileName);
	}

	private ResponseEntity<byte[]> excelResponse(byte[] file, String fileName) {
		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(ExcelExportSupport.XLSX_CONTENT_TYPE))
				.header(HttpHeaders.CONTENT_DISPOSITION, ExcelExportSupport.contentDisposition(fileName))
				.contentLength(file.length)
				.body(file);
	}
}
