package com.tphr.hr.records.dto;

import com.tphr.hr.records.Family;
import java.time.LocalDate;

public record FamilyResponse(
		Long id,
		Long employeeId,
		String familyName,
		String familyRelation,
		LocalDate birthDate,
		String job,
		Boolean livingTogether,
		Boolean dependent,
		Boolean disabled
) {

	public static FamilyResponse from(Family f) {
		return new FamilyResponse(f.getId(), f.getEmployee().getId(), f.getFamilyName(), f.getFamilyRelation(),
				f.getBirthDate(), f.getJob(), f.getLivingTogether(), f.getDependent(), f.getDisabled());
	}
}
