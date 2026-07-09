export type AppointmentType = "PROMOTION" | "TRANSFER" | "CONCURRENT";

export interface Appointment {
	id: number;
	documentNumber: string;
	employeeId: number;
	employeeNumber: string;
	employeeName: string;
	appointmentType: AppointmentType;
	fromDepartmentId: number | null;
	fromDepartmentName: string | null;
	toDepartmentId: number | null;
	toDepartmentName: string | null;
	fromPositionId: number | null;
	fromPositionName: string | null;
	toPositionId: number | null;
	toPositionName: string | null;
	appointmentDate: string;
	reason: string | null;
	registeredByName: string;
}
