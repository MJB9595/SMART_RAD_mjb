package com.tphr.hr.eventsupport;

import com.tphr.hr.eventsupport.dto.EventSupportApprovalRequest;
import com.tphr.hr.eventsupport.dto.EventSupportRequest;
import com.tphr.hr.eventsupport.dto.EventSupportResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/event-supports")
@RequiredArgsConstructor
public class EventSupportController {

	private final EventSupportService eventSupportService;

	@GetMapping
	public List<EventSupportResponse> getEventSupports() {
		return eventSupportService.getEventSupports();
	}

	@GetMapping("/employees/{employeeId}")
	public List<EventSupportResponse> getEventSupportsByEmployee(@PathVariable Long employeeId) {
		return eventSupportService.getEventSupportsByEmployee(employeeId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public EventSupportResponse createEventSupport(@Valid @RequestBody EventSupportRequest request) {
		return eventSupportService.createEventSupport(request);
	}

	@PatchMapping("/{id}/decision")
	@PreAuthorize("hasRole('ADMIN')")
	public EventSupportResponse decide(@PathVariable Long id, @RequestBody EventSupportApprovalRequest request) {
		return eventSupportService.decide(id, request);
	}
}
