import { apiFetch } from "@/lib/api/client";
import type { Appointment } from "@/lib/types/appointment";

export function listAppointments(): Promise<Appointment[]> {
	return apiFetch<Appointment[]>("/appointments");
}
