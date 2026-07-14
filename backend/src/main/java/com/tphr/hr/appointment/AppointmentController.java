package com.tphr.hr.appointment;

import com.tphr.hr.appointment.dto.AppointmentRequest;
import com.tphr.hr.appointment.dto.AppointmentResponse;
import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

	private final AppointmentService appointmentService;

	@GetMapping
	public Page<AppointmentResponse> getAppointments(
			@PageableDefault(size = 20, sort = "appointmentDate", direction = Sort.Direction.DESC) Pageable pageable) {
		return appointmentService.getAppointments(pageable);
	}

	@GetMapping("/employees/{employeeId}")
	public Page<AppointmentResponse> getAppointmentsByEmployee(@PathVariable Long employeeId,
			@PageableDefault(size = 20, sort = "appointmentDate", direction = Sort.Direction.DESC) Pageable pageable) {
		return appointmentService.getAppointmentsByEmployee(employeeId, pageable);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public AppointmentResponse createAppointment(@Valid @RequestBody AppointmentRequest request) {
		return appointmentService.createAppointment(request);
	}

	@PatchMapping("/{id}/approve")
	@PreAuthorize("hasRole('ADMIN')")
	public AppointmentResponse approve(@PathVariable Long id) {
		return appointmentService.approve(id);
	}

	@PatchMapping("/{id}/reject")
	@PreAuthorize("hasRole('ADMIN')")
	public AppointmentResponse reject(@PathVariable Long id) {
		return appointmentService.reject(id);
	}
}
