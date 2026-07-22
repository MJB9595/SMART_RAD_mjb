package com.tphr.hr.signup.dto;

import com.tphr.hr.common.StaffCategory;
import com.tphr.hr.employee.EmployeeRole;
import com.tphr.hr.signup.ApprovalSlot;
import com.tphr.hr.signup.SlotStatus;
import java.time.LocalDate;

/** 승인 자리(슬롯) 응답. */
public record SlotResponse(
		Long id,
		StaffCategory staffCategory,
		Long departmentId,
		String departmentName,
		Long positionId,
		String positionName,
		Long employmentTypeId,
		String employmentTypeName,
		EmployeeRole role,
		LocalDate hireDate,
		String label,
		SlotStatus status
) {

	public static SlotResponse from(ApprovalSlot s) {
		return new SlotResponse(
				s.getId(), s.getStaffCategory(),
				s.getDepartment().getId(), s.getDepartment().getName(),
				s.getPosition().getId(), s.getPosition().getName(),
				s.getEmploymentType().getId(), s.getEmploymentType().getName(),
				s.getRole(), s.getHireDate(), s.getLabel(), s.getStatus());
	}
}
