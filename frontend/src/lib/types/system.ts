export interface CommonCode {
	id: number;
	groupCode: string;
	code: string;
	name: string;
	sortOrder: number;
	parentCode: string | null;
	active: boolean;
}

export interface RoleInfo {
	id: number;
	code: string;
	name: string;
	description: string | null;
	active: boolean;
	permissions: string[];
}

export interface AuditLog {
	id: number;
	actorId: number | null;
	action: string;
	entityType: string | null;
	entityId: number | null;
	createdAt: string;
}
