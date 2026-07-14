package com.tphr.hr.salary;

import com.tphr.hr.salary.dto.SalaryBasicResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/salaries")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalaryController {

	private final SalaryBasicRepository salaryBasicRepository;

	@GetMapping
	public List<SalaryBasicResponse> getSalaries() {
		return salaryBasicRepository.findByDeletedFalseOrderByEmployee_EmployeeNumberAsc().stream()
				.map(SalaryBasicResponse::from)
				.toList();
	}
}
