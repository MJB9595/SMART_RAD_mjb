package com.tphr.hr.records.dto;

import com.tphr.hr.records.Education;
import java.time.LocalDate;

public record EducationResponse(
		Long id,
		Long employeeId,
		String schoolName,
		String major,
		String degree,
		LocalDate admissionDate,
		LocalDate graduationDate,
		String status
) {

	public static EducationResponse from(Education e) {
		return new EducationResponse(e.getId(), e.getEmployee().getId(), e.getSchoolName(), e.getMajor(),
				e.getDegree(), e.getAdmissionDate(), e.getGraduationDate(), e.getStatus());
	}
}
