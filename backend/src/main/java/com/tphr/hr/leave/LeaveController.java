package com.tphr.hr.leave;

import com.tphr.hr.leave.dto.LeaveBalanceResponse;
import com.tphr.hr.leave.dto.LeaveRequestCreate;
import com.tphr.hr.leave.dto.LeaveRequestResponse;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/leaves")
@RequiredArgsConstructor
public class LeaveController {

	private final LeaveService leaveService;

	@GetMapping
	public Page<LeaveRequestResponse> getLeaveRequests(
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		return leaveService.getLeaveRequests(pageable);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public LeaveRequestResponse createLeaveRequest(@Valid @RequestBody LeaveRequestCreate request) {
		return leaveService.createLeaveRequest(request);
	}

	@PatchMapping("/{id}/approve")
	@PreAuthorize("hasRole('ADMIN')")
	public LeaveRequestResponse approve(@PathVariable Long id) {
		return leaveService.approve(id);
	}

	@PatchMapping("/{id}/reject")
	@PreAuthorize("hasRole('ADMIN')")
	public LeaveRequestResponse reject(@PathVariable Long id) {
		return leaveService.reject(id);
	}

	@GetMapping("/balances")
	public List<LeaveBalanceResponse> getLeaveBalances(
			@RequestParam(required = false) Integer year) {
		return leaveService.getLeaveBalances(year != null ? year : LocalDate.now().getYear());
	}
}
