package com.tphr.hr.payroll;

import static com.tphr.hr.common.excel.ExcelExportSupport.finishSheet;
import static com.tphr.hr.common.excel.ExcelExportSupport.setNumber;
import static com.tphr.hr.common.excel.ExcelExportSupport.setText;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.common.excel.ExcelExportSupport;
import com.tphr.hr.common.excel.ExcelExportSupport.Styles;
import com.tphr.hr.employee.Employee;
import java.time.DateTimeException;
import java.time.YearMonth;
import java.util.List;
import java.util.Locale;
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
public class PayrollExcelService {

	private static final String[] PAYROLL_HEADERS = {
			"급여년월", "지급일", "사번", "성명", "소속", "직급", "총지급액", "총공제액", "실지급액", "상태"
	};

	private final PayrollRepository payrollRepository;

	public byte[] exportAll() {
		List<Payroll> payrolls = payrollRepository.findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc();
		return createPayrollRegister("급여 대장", "급여 대장", payrolls);
	}

	public byte[] exportOne(Long id) {
		Payroll payroll = payrollRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("급여 명세서를 찾을 수 없습니다. id=" + id));

		try (XSSFWorkbook workbook = new XSSFWorkbook()) {
			Styles styles = ExcelExportSupport.createStyles(workbook);
			Sheet sheet = ExcelExportSupport.createSheet(workbook, "급여 명세서",
					payroll.getPayrollYearMonth() + " " + payroll.getEmployee().getName() + " 급여 명세서",
					new String[]{"항목", "내용"}, styles);

			int rowIndex = 2;
			rowIndex = addDetailText(sheet, rowIndex, "사번", payroll.getEmployee().getEmployeeNumber(), styles);
			rowIndex = addDetailText(sheet, rowIndex, "성명", payroll.getEmployee().getName(), styles);
			rowIndex = addDetailText(sheet, rowIndex, "소속", payroll.getDepartmentNameSnapshot(), styles);
			rowIndex = addDetailText(sheet, rowIndex, "직급", payroll.getPositionNameSnapshot(), styles);
			rowIndex = addDetailText(sheet, rowIndex, "급여년월", formatYearMonth(payroll.getPayrollYearMonth()), styles);

			Row paymentDateRow = sheet.createRow(rowIndex++);
			setText(paymentDateRow, 0, "지급일", styles.header());
			Cell paymentDate = paymentDateRow.createCell(1);
			if (payroll.getPaymentDate() != null) {
				paymentDate.setCellValue(payroll.getPaymentDate());
			}
			paymentDate.setCellStyle(styles.date());

			rowIndex = addDetailNumber(sheet, rowIndex, "총지급액", payroll.getTotalPayAmount(), styles);
			rowIndex = addDetailNumber(sheet, rowIndex, "총공제액", payroll.getTotalDeductionAmount(), styles);
			rowIndex = addDetailNumber(sheet, rowIndex, "실지급액", payroll.getRealPayAmount(), styles);
			rowIndex = addDetailText(sheet, rowIndex, "상태", statusLabel(payroll.getPayrollStatusCode()), styles);

			finishSheet(sheet, rowIndex - 1, new int[]{20, 32});
			return ExcelExportSupport.toBytes(workbook);
		} catch (Exception exception) {
			throw new IllegalStateException("급여 명세서 엑셀 생성에 실패했습니다.", exception);
		}
	}

	public byte[] exportSettlement(String yearMonthValue, String formTypeValue) {
		YearMonth yearMonth = parseYearMonth(yearMonthValue);
		SettlementFormType formType = SettlementFormType.from(formTypeValue);
		String normalizedYearMonth = "%04d%02d".formatted(yearMonth.getYear(), yearMonth.getMonthValue());
		List<Payroll> payrolls = payrollRepository.findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc()
				.stream()
				.filter(payroll -> normalizedYearMonth.equals(payroll.getPayrollYearMonth()))
				.filter(payroll -> isConfirmed(payroll.getPayrollStatusCode()))
				.toList();

		return switch (formType) {
			case BANK -> createBankSettlement(yearMonth, payrolls);
			case ACCOUNTING -> createAccountingSettlement(yearMonth, payrolls);
			case FULL -> createFullSettlement(yearMonth, payrolls);
		};
	}

	private byte[] createPayrollRegister(String sheetName, String title, List<Payroll> payrolls) {
		try (XSSFWorkbook workbook = new XSSFWorkbook()) {
			Styles styles = ExcelExportSupport.createStyles(workbook);
			Sheet sheet = ExcelExportSupport.createSheet(workbook, sheetName, title, PAYROLL_HEADERS, styles);
			int rowIndex = writePayrollRows(sheet, payrolls, styles);
			finishSheet(sheet, rowIndex - 1, new int[]{12, 14, 14, 14, 22, 14, 16, 16, 16, 14});
			return ExcelExportSupport.toBytes(workbook);
		} catch (Exception exception) {
			throw new IllegalStateException("급여 대장 엑셀 생성에 실패했습니다.", exception);
		}
	}

	private int writePayrollRows(Sheet sheet, List<Payroll> payrolls, Styles styles) {
		int rowIndex = 2;
		for (Payroll payroll : payrolls) {
			Row row = sheet.createRow(rowIndex++);
			setText(row, 0, formatYearMonth(payroll.getPayrollYearMonth()), styles.center());
			Cell paymentDate = row.createCell(1);
			if (payroll.getPaymentDate() != null) {
				paymentDate.setCellValue(payroll.getPaymentDate());
			}
			paymentDate.setCellStyle(styles.date());
			setText(row, 2, payroll.getEmployee().getEmployeeNumber(), styles.center());
			setText(row, 3, payroll.getEmployee().getName(), styles.text());
			setText(row, 4, payroll.getDepartmentNameSnapshot(), styles.text());
			setText(row, 5, payroll.getPositionNameSnapshot(), styles.text());
			setNumber(row, 6, payroll.getTotalPayAmount(), styles.currency());
			setNumber(row, 7, payroll.getTotalDeductionAmount(), styles.currency());
			setNumber(row, 8, payroll.getRealPayAmount(), styles.currency());
			setText(row, 9, statusLabel(payroll.getPayrollStatusCode()), styles.center());
		}
		if (payrolls.isEmpty()) {
			setText(sheet.createRow(rowIndex++), 0, "출력할 급여 데이터가 없습니다.", styles.text());
		}
		return rowIndex;
	}

	private byte[] createBankSettlement(YearMonth yearMonth, List<Payroll> payrolls) {
		String[] headers = {"사번(식별값)", "성명", "은행", "계좌번호", "예금주", "이체금액", "지급일"};
		try (XSSFWorkbook workbook = new XSSFWorkbook()) {
			Styles styles = ExcelExportSupport.createStyles(workbook);
			Sheet sheet = ExcelExportSupport.createSheet(workbook, "은행 전송용",
					yearMonth + " 은행 전송용 급여 정산", headers, styles);
			int rowIndex = 2;
			for (Payroll payroll : payrolls) {
				Employee employee = payroll.getEmployee();
				Row row = sheet.createRow(rowIndex++);
				setText(row, 0, employee.getEmployeeNumber(), styles.center());
				setText(row, 1, employee.getName(), styles.text());
				setText(row, 2, employee.getBankName(), styles.text());
				setText(row, 3, employee.getAccountNumber(), styles.center());
				setText(row, 4, employee.getAccountHolder(), styles.text());
				setNumber(row, 5, payroll.getRealPayAmount(), styles.currency());
				Cell paymentDate = row.createCell(6);
				if (payroll.getPaymentDate() != null) {
					paymentDate.setCellValue(payroll.getPaymentDate());
				}
				paymentDate.setCellStyle(styles.date());
			}
			rowIndex = addEmptyMessage(sheet, rowIndex, payrolls, styles);
			finishSheet(sheet, rowIndex - 1, new int[]{18, 14, 16, 24, 14, 18, 14});
			return ExcelExportSupport.toBytes(workbook);
		} catch (Exception exception) {
			throw new IllegalStateException("은행 전송용 엑셀 생성에 실패했습니다.", exception);
		}
	}

	private byte[] createAccountingSettlement(YearMonth yearMonth, List<Payroll> payrolls) {
		String[] headers = {
				"급여년월", "사번", "성명", "소속", "직급", "총지급액", "총공제액", "실지급액", "지급일", "상태"
		};
		try (XSSFWorkbook workbook = new XSSFWorkbook()) {
			Styles styles = ExcelExportSupport.createStyles(workbook);
			Sheet sheet = ExcelExportSupport.createSheet(workbook, "회계 처리용",
					yearMonth + " 회계 처리용 급여 정산", headers, styles);
			int rowIndex = writePayrollRows(sheet, payrolls, styles);
			finishSheet(sheet, rowIndex - 1, new int[]{12, 14, 14, 22, 14, 16, 16, 16, 14, 14});
			return ExcelExportSupport.toBytes(workbook);
		} catch (Exception exception) {
			throw new IllegalStateException("회계 처리용 엑셀 생성에 실패했습니다.", exception);
		}
	}

	private byte[] createFullSettlement(YearMonth yearMonth, List<Payroll> payrolls) {
		String[] headers = {
				"급여년월", "지급일", "사번", "성명", "소속", "직급", "은행", "계좌번호", "예금주",
				"총지급액", "총공제액", "실지급액", "상태"
		};
		try (XSSFWorkbook workbook = new XSSFWorkbook()) {
			Styles styles = ExcelExportSupport.createStyles(workbook);
			Sheet sheet = ExcelExportSupport.createSheet(workbook, "전체 급여대장",
					yearMonth + " 전체 급여대장", headers, styles);
			int rowIndex = 2;
			for (Payroll payroll : payrolls) {
				Employee employee = payroll.getEmployee();
				Row row = sheet.createRow(rowIndex++);
				setText(row, 0, formatYearMonth(payroll.getPayrollYearMonth()), styles.center());
				Cell paymentDate = row.createCell(1);
				if (payroll.getPaymentDate() != null) {
					paymentDate.setCellValue(payroll.getPaymentDate());
				}
				paymentDate.setCellStyle(styles.date());
				setText(row, 2, employee.getEmployeeNumber(), styles.center());
				setText(row, 3, employee.getName(), styles.text());
				setText(row, 4, payroll.getDepartmentNameSnapshot(), styles.text());
				setText(row, 5, payroll.getPositionNameSnapshot(), styles.text());
				setText(row, 6, employee.getBankName(), styles.text());
				setText(row, 7, employee.getAccountNumber(), styles.center());
				setText(row, 8, employee.getAccountHolder(), styles.text());
				setNumber(row, 9, payroll.getTotalPayAmount(), styles.currency());
				setNumber(row, 10, payroll.getTotalDeductionAmount(), styles.currency());
				setNumber(row, 11, payroll.getRealPayAmount(), styles.currency());
				setText(row, 12, statusLabel(payroll.getPayrollStatusCode()), styles.center());
			}
			rowIndex = addEmptyMessage(sheet, rowIndex, payrolls, styles);
			finishSheet(sheet, rowIndex - 1, new int[]{12, 14, 14, 14, 22, 14, 16, 24, 14, 16, 16, 16, 14});
			return ExcelExportSupport.toBytes(workbook);
		} catch (Exception exception) {
			throw new IllegalStateException("전체 급여대장 엑셀 생성에 실패했습니다.", exception);
		}
	}

	private int addDetailText(Sheet sheet, int rowIndex, String label, String value, Styles styles) {
		Row row = sheet.createRow(rowIndex);
		setText(row, 0, label, styles.header());
		setText(row, 1, value, styles.text());
		return rowIndex + 1;
	}

	private int addDetailNumber(Sheet sheet, int rowIndex, String label, Number value, Styles styles) {
		Row row = sheet.createRow(rowIndex);
		setText(row, 0, label, styles.header());
		setNumber(row, 1, value, styles.currency());
		return rowIndex + 1;
	}

	private int addEmptyMessage(Sheet sheet, int rowIndex, List<Payroll> payrolls, Styles styles) {
		if (payrolls.isEmpty()) {
			setText(sheet.createRow(rowIndex++), 0, "해당 월의 확정 급여 데이터가 없습니다.", styles.text());
		}
		return rowIndex;
	}

	private YearMonth parseYearMonth(String value) {
		if (value == null || !value.matches("\\d{6}")) {
			throw ApiException.badRequest("급여년월은 YYYYMM 형식이어야 합니다.");
		}
		try {
			return YearMonth.of(Integer.parseInt(value.substring(0, 4)), Integer.parseInt(value.substring(4, 6)));
		} catch (DateTimeException exception) {
			throw ApiException.badRequest("유효한 급여년월을 입력해 주세요.");
		}
	}

	private boolean isConfirmed(String status) {
		return "CONFIRMED".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status);
	}

	private String formatYearMonth(String yearMonth) {
		if (yearMonth == null || !yearMonth.matches("\\d{6}")) {
			return yearMonth == null ? "" : yearMonth;
		}
		return yearMonth.substring(0, 4) + "-" + yearMonth.substring(4, 6);
	}

	private String statusLabel(String status) {
		if (status == null) {
			return "";
		}
		return switch (status.toUpperCase(Locale.ROOT)) {
			case "DRAFT" -> "작성중";
			case "CONFIRMED" -> "확정";
			case "PAID" -> "지급완료";
			default -> status;
		};
	}

	private enum SettlementFormType {
		BANK,
		ACCOUNTING,
		FULL;

		private static SettlementFormType from(String value) {
			return switch (value == null ? "" : value.toLowerCase(Locale.ROOT)) {
				case "bank" -> BANK;
				case "acc" -> ACCOUNTING;
				case "full" -> FULL;
				default -> throw ApiException.badRequest("지원하지 않는 정산 엑셀 양식입니다.");
			};
		}
	}
}
