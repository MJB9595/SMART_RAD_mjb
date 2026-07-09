package com.tphr.hr.eventsupport;

import com.tphr.hr.common.exception.ApiException;
import com.tphr.hr.common.util.DocumentNumberGenerator;
import com.tphr.hr.employee.Employee;
import com.tphr.hr.employee.EmployeeRepository;
import com.tphr.hr.eventsupport.dto.EventSupportApprovalRequest;
import com.tphr.hr.eventsupport.dto.EventSupportRequest;
import com.tphr.hr.eventsupport.dto.EventSupportResponse;
import com.tphr.hr.security.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventSupportService {

	private static final String DOCUMENT_PREFIX = "ES";

	private final EmployeeEventSupportRepository eventSupportRepository;
	private final EmployeeRepository employeeRepository;
	private final DocumentNumberGenerator documentNumberGenerator;

	public List<EventSupportResponse> getEventSupportsByEmployee(Long employeeId) {
		return eventSupportRepository.findByEmployee_IdAndDeletedFalseOrderByCreatedAtDesc(employeeId).stream()
				.map(EventSupportResponse::from)
				.toList();
	}

	public List<EventSupportResponse> getEventSupports() {
		return eventSupportRepository.findByDeletedFalseOrderByCreatedAtDesc().stream()
				.map(EventSupportResponse::from)
				.toList();
	}

	@Transactional
	public EventSupportResponse createEventSupport(EventSupportRequest request) {
		Employee employee = employeeRepository.findById(request.employeeId())
				.orElseThrow(() -> ApiException.notFound("사원을 찾을 수 없습니다. id=" + request.employeeId()));

		String documentNumber = documentNumberGenerator.generate(DOCUMENT_PREFIX);

		EmployeeEventSupport eventSupport = new EmployeeEventSupport(documentNumber, employee, request.eventType(),
				request.amount(), request.eventDate(), request.description());

		return EventSupportResponse.from(eventSupportRepository.save(eventSupport));
	}

	@Transactional
	public EventSupportResponse decide(Long id, EventSupportApprovalRequest request) {
		EmployeeEventSupport eventSupport = eventSupportRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("경조비 신청을 찾을 수 없습니다. id=" + id));

		Employee approver = employeeRepository.findById(SecurityUtils.getCurrentEmployeeId())
				.orElseThrow(() -> ApiException.unauthorized("승인자 정보를 확인할 수 없습니다."));

		if (request.approve()) {
			eventSupport.approve(approver);
		} else {
			eventSupport.reject(approver);
		}

		return EventSupportResponse.from(eventSupport);
	}
}
