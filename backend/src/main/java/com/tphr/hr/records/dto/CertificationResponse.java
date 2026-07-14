package com.tphr.hr.records.dto;

import com.tphr.hr.records.Certification;
import java.time.LocalDate;

public record CertificationResponse(
		Long id,
		Long employeeId,
		String name,
		String issuer,
		String certNumber,
		LocalDate acquiredDate,
		LocalDate expiryDate
) {

	public static CertificationResponse from(Certification c) {
		return new CertificationResponse(c.getId(), c.getEmployee().getId(), c.getName(), c.getIssuer(),
				c.getCertNumber(), c.getAcquiredDate(), c.getExpiryDate());
	}
}
