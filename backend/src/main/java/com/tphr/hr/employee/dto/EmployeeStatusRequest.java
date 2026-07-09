package com.tphr.hr.employee.dto;

import com.tphr.hr.employee.EmploymentStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record EmployeeStatusRequest(

		@NotNull(message = "재직상태는 필수입니다.")
		EmploymentStatus employmentStatus,

		LocalDate resignDate
) {
}
