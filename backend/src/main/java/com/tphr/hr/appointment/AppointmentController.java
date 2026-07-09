package com.tphr.hr.appointment;

import com.tphr.hr.appointment.dto.AppointmentRequest;
import com.tphr.hr.appointment.dto.AppointmentResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
	public List<AppointmentResponse> getAppointments() {
		return appointmentService.getAppointments();
	}

	@GetMapping("/employees/{employeeId}")
	public List<AppointmentResponse> getAppointmentsByEmployee(@PathVariable Long employeeId) {
		return appointmentService.getAppointmentsByEmployee(employeeId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public AppointmentResponse createAppointment(@Valid @RequestBody AppointmentRequest request) {
		return appointmentService.createAppointment(request);
	}
}
