package com.tphr.hr.payroll;

import com.tphr.hr.payroll.dto.PayrollResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payrolls")
@RequiredArgsConstructor
@Transactional(readOnly = true)
@PreAuthorize("hasRole('ADMIN')")
public class PayrollController {

	private final PayrollRepository payrollRepository;

	@GetMapping
	public List<PayrollResponse> getPayrolls() {
		return payrollRepository.findByDeletedFalseOrderByPayrollYearMonthDescEmployee_EmployeeNumberAsc().stream()
				.map(PayrollResponse::from)
				.toList();
	}
}
