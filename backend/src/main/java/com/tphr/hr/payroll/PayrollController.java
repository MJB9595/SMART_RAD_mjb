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

	/**
	 * 급여 대장 목록.
	 *
	 * <p>화면에 필터 버튼만 있고 조건이 없어 전체만 볼 수 있었다. 급여월·상태·이름/사번으로 좁힌다.
	 * 조건은 모두 선택이며, 주지 않으면 예전처럼 전체가 나온다.
	 *
	 * @param yearMonth 급여월 (예: 2026-07)
	 * @param status    지급 상태 코드
	 * @param keyword   교직원 이름 또는 사번 일부
	 */
	@GetMapping
	public List<PayrollResponse> getPayrolls(
			@RequestParam(required = false) String yearMonth,
			@RequestParam(required = false) String status,
			@RequestParam(required = false) String keyword) {
		String needle = keyword == null ? null : keyword.trim().toLowerCase();
		return payrollRepository.findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc().stream()
				.filter(p -> yearMonth == null || yearMonth.isBlank() || yearMonth.equals(p.getPayrollYearMonth()))
				.filter(p -> status == null || status.isBlank() || status.equals(p.getPayrollStatusCode()))
				.filter(p -> needle == null || needle.isBlank()
						|| p.getEmployee().getName().toLowerCase().contains(needle)
						|| p.getEmployee().getEmployeeNumber().toLowerCase().contains(needle))
				.map(PayrollResponse::from)
				.toList();
	}

	/** 필터 선택지 — 화면이 임의로 목록을 만들지 않도록 실제 데이터에서 뽑아 준다. */
	@GetMapping("/filter-options")
	public PayrollFilterOptions getFilterOptions() {
		List<Payroll> all = payrollRepository.findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc();
		return new PayrollFilterOptions(
				all.stream().map(Payroll::getPayrollYearMonth).distinct().sorted(java.util.Comparator.reverseOrder()).toList(),
				all.stream().map(Payroll::getPayrollStatusCode).distinct().sorted().toList());
	}

	public record PayrollFilterOptions(List<String> yearMonths, List<String> statuses) {
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
