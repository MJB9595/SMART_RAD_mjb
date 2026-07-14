package com.tphr.hr.records.dto;

import com.tphr.hr.records.Career;
import java.time.LocalDate;

public record CareerResponse(
		Long id,
		Long employeeId,
		String companyName,
		String department,
		String position,
		String jobDescription,
		LocalDate startDate,
		LocalDate endDate
) {

	public static CareerResponse from(Career c) {
		return new CareerResponse(c.getId(), c.getEmployee().getId(), c.getCompanyName(), c.getDepartment(),
				c.getPosition(), c.getJobDescription(), c.getStartDate(), c.getEndDate());
	}
}
