package com.tphr.hr.common.excel;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public final class ExcelExportSupport {

	public static final String XLSX_CONTENT_TYPE =
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

	private ExcelExportSupport() {
	}

	public record Styles(
			CellStyle title,
			CellStyle header,
			CellStyle text,
			CellStyle center,
			CellStyle integer,
			CellStyle currency,
			CellStyle date
	) {
	}

	public static Styles createStyles(XSSFWorkbook workbook) {
		Font titleFont = workbook.createFont();
		titleFont.setBold(true);
		titleFont.setFontHeightInPoints((short) 16);
		titleFont.setColor(IndexedColors.WHITE.getIndex());

		CellStyle title = workbook.createCellStyle();
		title.setFont(titleFont);
		title.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
		title.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		title.setAlignment(HorizontalAlignment.LEFT);
		title.setVerticalAlignment(VerticalAlignment.CENTER);

		Font headerFont = workbook.createFont();
		headerFont.setBold(true);
		headerFont.setColor(IndexedColors.WHITE.getIndex());

		CellStyle header = workbook.createCellStyle();
		header.setFont(headerFont);
		header.setFillForegroundColor(IndexedColors.INDIGO.getIndex());
		header.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		header.setAlignment(HorizontalAlignment.CENTER);
		header.setVerticalAlignment(VerticalAlignment.CENTER);
		setBorders(header);

		CellStyle text = workbook.createCellStyle();
		text.setVerticalAlignment(VerticalAlignment.CENTER);
		setBorders(text);

		CellStyle center = workbook.createCellStyle();
		center.cloneStyleFrom(text);
		center.setAlignment(HorizontalAlignment.CENTER);

		CellStyle integer = workbook.createCellStyle();
		integer.cloneStyleFrom(text);
		integer.setAlignment(HorizontalAlignment.RIGHT);
		integer.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));

		CellStyle currency = workbook.createCellStyle();
		currency.cloneStyleFrom(integer);
		currency.setDataFormat(workbook.createDataFormat().getFormat("#,##0\"원\""));

		CellStyle date = workbook.createCellStyle();
		date.cloneStyleFrom(center);
		date.setDataFormat(workbook.createDataFormat().getFormat("yyyy-mm-dd"));

		return new Styles(title, header, text, center, integer, currency, date);
	}

	public static Sheet createSheet(XSSFWorkbook workbook, String sheetName, String titleText,
			String[] headers, Styles styles) {
		Sheet sheet = workbook.createSheet(sheetName);
		sheet.setDisplayGridlines(false);
		sheet.createFreezePane(0, 2);

		Row titleRow = sheet.createRow(0);
		titleRow.setHeightInPoints(30);
		Cell titleCell = titleRow.createCell(0);
		titleCell.setCellValue(titleText);
		titleCell.setCellStyle(styles.title());
		for (int index = 1; index < headers.length; index++) {
			Cell mergedCell = titleRow.createCell(index);
			mergedCell.setCellStyle(styles.title());
		}
		if (headers.length > 1) {
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, headers.length - 1));
		}

		Row headerRow = sheet.createRow(1);
		headerRow.setHeightInPoints(24);
		for (int index = 0; index < headers.length; index++) {
			Cell cell = headerRow.createCell(index);
			cell.setCellValue(headers[index]);
			cell.setCellStyle(styles.header());
		}
		return sheet;
	}

	public static void setText(Row row, int column, String value, CellStyle style) {
		Cell cell = row.createCell(column);
		if (value != null && !value.isEmpty()) {
			cell.setCellValue(value);
		}
		cell.setCellStyle(style);
	}

	public static void setNumber(Row row, int column, Number value, CellStyle style) {
		Cell cell = row.createCell(column);
		if (value != null) {
			cell.setCellValue(value.doubleValue());
		}
		cell.setCellStyle(style);
	}

	public static void finishSheet(Sheet sheet, int lastRow, int[] columnWidths) {
		if (columnWidths.length > 0) {
			sheet.setAutoFilter(new CellRangeAddress(1, Math.max(1, lastRow), 0, columnWidths.length - 1));
		}
		for (int index = 0; index < columnWidths.length; index++) {
			sheet.setColumnWidth(index, Math.min(columnWidths[index], 255) * 256);
		}
	}

	public static byte[] toBytes(XSSFWorkbook workbook) {
		workbook.setForceFormulaRecalculation(true);
		workbook.getCreationHelper().createFormulaEvaluator().evaluateAll();
		try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
			workbook.write(output);
			return output.toByteArray();
		} catch (IOException exception) {
			throw new IllegalStateException("엑셀 파일 생성에 실패했습니다.", exception);
		}
	}

	public static String contentDisposition(String fileName) {
		String encoded = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replace("+", "%20");
		return "attachment; filename*=UTF-8''" + encoded;
	}

	private static void setBorders(CellStyle style) {
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		style.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
	}
}
