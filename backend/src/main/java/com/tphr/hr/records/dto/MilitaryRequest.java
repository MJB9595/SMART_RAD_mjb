package com.tphr.hr.records.dto;

import java.time.LocalDate;

public record MilitaryRequest(

		String militaryType,

		String militaryRank,

		String dischargeType,

		LocalDate enlistmentDate,

		LocalDate dischargeDate,

		String exemptionReason
) {
}
