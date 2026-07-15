package com.tphr.hr.records.dto;

import com.tphr.hr.records.Language;
import java.time.LocalDate;

public record LanguageResponse(
		Long id,
		Long employeeId,
		String languageName,
		String readingLevel,
		String writingLevel,
		String speakingLevel,
		String testName,
		String testScore,
		LocalDate issuedDate,
		String issuer
) {

	public static LanguageResponse from(Language l) {
		return new LanguageResponse(l.getId(), l.getEmployee().getId(), l.getLanguageName(), l.getReadingLevel(),
				l.getWritingLevel(), l.getSpeakingLevel(), l.getTestName(), l.getTestScore(), l.getIssuedDate(),
				l.getIssuer());
	}
}
