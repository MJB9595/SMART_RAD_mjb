import { apiFetch } from "@/lib/api/client";
import type { EventSupport } from "@/lib/types/eventSupport";

export function listEventSupports(): Promise<EventSupport[]> {
	return apiFetch<EventSupport[]>("/event-supports");
}
