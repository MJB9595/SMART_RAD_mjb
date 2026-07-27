import { apiFetch } from "@/lib/api/client";
import type { Appointment, AppointmentType } from "@/lib/types/appointment";
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

export interface AppointmentRequestCreate {
	employeeId: number;
	appointmentType: AppointmentType;
	fromDepartmentId?: number | null;
	toDepartmentId?: number | null;
	fromPositionId?: number | null;
	toPositionId?: number | null;
	appointmentDate: string;
	reason?: string;
}

export function createAppointment(body: AppointmentRequestCreate): Promise<Appointment> {
	return apiFetch<Appointment>("/appointments", { method: "POST", body });
}
