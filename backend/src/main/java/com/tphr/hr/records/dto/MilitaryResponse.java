package com.tphr.hr.records.dto;

import com.tphr.hr.records.Military;
import java.time.LocalDate;

public record MilitaryResponse(
		Long id,
		Long employeeId,
		String militaryType,
		String militaryRank,
		String dischargeType,
		LocalDate enlistmentDate,
		LocalDate dischargeDate,
		String exemptionReason
) {

	public static MilitaryResponse from(Military m) {
		return new MilitaryResponse(m.getId(), m.getEmployee().getId(), m.getMilitaryType(), m.getMilitaryRank(),
				m.getDischargeType(), m.getEnlistmentDate(), m.getDischargeDate(), m.getExemptionReason());
	}
}
