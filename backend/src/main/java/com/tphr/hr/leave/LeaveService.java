package com.tphr.hr.leave;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.common.util.DocumentNumberGenerator;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.leave.dto.LeaveBalanceResponse;
import com.tphr.hr.leave.dto.LeaveRequestCreate;
import com.tphr.hr.leave.dto.LeaveRequestResponse;
import com.tphr.hr.security.SecurityUtils;
import com.tphr.hr.system.AuditLogService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaveService {

	private static final String DOCUMENT_PREFIX = "LVE";

	private final LeaveRequestRepository leaveRequestRepository;
	private final LeaveBalanceRepository leaveBalanceRepository;
	private final LeaveTypeRepository leaveTypeRepository;
	private final EmployeeRepository employeeRepository;
	private final DocumentNumberGenerator documentNumberGenerator;
	private final AuditLogService auditLogService;

	public List<LeaveType> getLeaveTypes() {
		return leaveTypeRepository.findByDeletedFalseOrderByIdAsc();
	}

	public Page<LeaveRequestResponse> getLeaveRequests(Pageable pageable) {
		return leaveRequestRepository.findByDeletedFalseOrderByCreatedAtDesc(pageable)
				.map(LeaveRequestResponse::from);
	}

	@Transactional
	public LeaveRequestResponse createLeaveRequest(LeaveRequestCreate request) {
		Employee employee = findEmployee(request.employeeId());
		LeaveType leaveType = leaveTypeRepository.findByIdAndDeletedFalse(request.leaveTypeId())
				.orElseThrow(() -> ApiException.notFound("휴가유형을 찾을 수 없습니다. id=" + request.leaveTypeId()));
		String documentNumber = documentNumberGenerator.generate(DOCUMENT_PREFIX);

		LeaveRequest leaveRequest = LeaveRequest.builder()
				.documentNumber(documentNumber)
				.leaveType(leaveType)
				.employee(employee)
				.startDate(request.startDate())
				.endDate(request.endDate())
				.days(request.days())
				.reason(request.reason())
				.build();
		return LeaveRequestResponse.from(leaveRequestRepository.save(leaveRequest));
	}

	/** 승인 시 연차라면 잔여일수에서 차감. */
	@Transactional
	public LeaveRequestResponse approve(Long id) {
		LeaveRequest leaveRequest = findActive(id);
		Employee approver = findEmployee(SecurityUtils.getCurrentEmployeeId());

		if (leaveRequest.getLeaveType().isAnnual()) {
			int year = leaveRequest.getStartDate().getYear();
			LeaveBalance balance = leaveBalanceRepository
					.findByEmployee_IdAndLeaveType_IdAndYearAndDeletedFalse(
							leaveRequest.getEmployee().getId(), leaveRequest.getLeaveType().getId(), year)
					.orElseThrow(() -> ApiException.conflict(year + "년도 연차 잔여 정보가 없습니다."));
			balance.consume(leaveRequest.getDays());
		}

		leaveRequest.approve(approver);
		auditLogService.record("APPROVE", "LEAVE_REQUEST", leaveRequest.getId());
		return LeaveRequestResponse.from(leaveRequest);
	}

	@Transactional
	public LeaveRequestResponse reject(Long id) {
		LeaveRequest leaveRequest = findActive(id);
		Employee approver = findEmployee(SecurityUtils.getCurrentEmployeeId());
		leaveRequest.reject(approver);
		return LeaveRequestResponse.from(leaveRequest);
	}

	public List<LeaveBalanceResponse> getLeaveBalances(int year) {
		return leaveBalanceRepository.findByYearAndDeletedFalseOrderByEmployee_EmployeeNumberAsc(year).stream()
				.map(LeaveBalanceResponse::from)
				.toList();
	}

	private LeaveRequest findActive(Long id) {
		return leaveRequestRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("휴가 신청을 찾을 수 없습니다. id=" + id));
	}

	private Employee findEmployee(Long id) {
		return employeeRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> ApiException.notFound("교직원을 찾을 수 없습니다. id=" + id));
	}
}
