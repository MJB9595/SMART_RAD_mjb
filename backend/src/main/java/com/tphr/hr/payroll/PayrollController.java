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
import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.security.SecurityUtils;
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
	 * <p>급여는 가장 민감한 정보라, 관리자·인사팀이 아니면 본인 급여만 보인다.
	 * (PAYROLL_READ 는 '급여 화면을 쓸 수 있다'는 뜻이지 '남의 급여를 본다'는 뜻이 아니다)
	 *
	 * @param yearMonth 급여월 (예: 202607)
	 * @param status    지급 상태 코드
	 * @param keyword   교직원 이름 또는 사번 일부
	 */
	@GetMapping
	public List<PayrollResponse> getPayrolls(
			@RequestParam(required = false) String yearMonth,
			@RequestParam(required = false) String status,
			@RequestParam(required = false) String keyword) {
		String needle = keyword == null ? null : keyword.trim().toLowerCase();
		return visiblePayrolls().stream()
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
		List<Payroll> visible = visiblePayrolls();
		return new PayrollFilterOptions(
				visible.stream().map(Payroll::getPayrollYearMonth).distinct().sorted(java.util.Comparator.reverseOrder()).toList(),
				visible.stream().map(Payroll::getPayrollStatusCode).distinct().sorted().toList());
	}

	/** 이 사용자가 볼 수 있는 급여 — 관리자·인사팀은 전체, 그 외는 본인 것만. */
	private List<Payroll> visiblePayrolls() {
		List<Payroll> all = payrollRepository.findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc();
		if (SecurityUtils.isAdminOrHr()) {
			return all;
		}
		Long me = SecurityUtils.getCurrentEmployeeId();
		return all.stream().filter(p -> p.getEmployee().getId().equals(me)).toList();
	}

	public record PayrollFilterOptions(List<String> yearMonths, List<String> statuses) {
	}

	/** 전 직원 급여대장 — 관리자·인사팀 전용. */
	@GetMapping("/export")
	@PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
	public ResponseEntity<byte[]> exportPayrolls() {
		return excelResponse(payrollExcelService.exportAll(), "급여대장.xlsx");
	}

	/** 개인 급여명세서 — 본인 것이거나 관리자·인사팀만. */
	@GetMapping("/{id}/export")
	public ResponseEntity<byte[]> exportPayroll(@PathVariable Long id) {
		if (!SecurityUtils.isAdminOrHr()) {
			Payroll target = payrollRepository.findByIdAndDeletedFalse(id)
					.orElseThrow(() -> ApiException.notFound("급여 내역을 찾을 수 없습니다. id=" + id));
			if (!target.getEmployee().getId().equals(SecurityUtils.getCurrentEmployeeId())) {
				throw ApiException.forbidden("본인 급여명세서만 내려받을 수 있습니다.");
			}
		}
		return excelResponse(payrollExcelService.exportOne(id), "급여명세서_" + id + ".xlsx");
	}

	/** 정산 자료는 전 직원 급여를 담으므로 관리자·인사팀 전용. */
	@GetMapping("/settlement/export")
	@PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
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
