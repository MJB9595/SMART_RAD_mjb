import { apiFetch } from "@/lib/api/client";
import type { Appointment } from "@/lib/types/appointment";
import type { Page } from "@/lib/types/employee";

export function listAppointments(size = 50): Promise<Page<Appointment>> {
	return apiFetch<Page<Appointment>>(`/appointments?size=${size}`);
}

export function approveAppointment(id: number): Promise<Appointment> {
	return apiFetch<Appointment>(`/appointments/${id}/approve`, { method: "PATCH" });
}

export function rejectAppointment(id: number): Promise<Appointment> {
	return apiFetch<Appointment>(`/appointments/${id}/reject`, { method: "PATCH" });
}
