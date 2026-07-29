export interface CommonCode {
	id: number;
	groupCode: string;
	code: string;
	name: string;
	sortOrder: number;
	parentCode: string | null;
	active: boolean;
}

export interface CommonCodeUpsertBody {
	groupCode: string;
	code: string;
	name: string;
	sortOrder: number;
	parentCode?: string | null;
}

export interface RoleInfo {
	id: number;
	code: string;
	name: string;
	description: string | null;
	active: boolean;
	permissions: string[];
}

export interface PermissionInfo {
	id: number;
	code: string;
	name: string;
	resource: string | null;
	action: string | null;
}

export interface RoleUpsertBody {
	code: string;
	name: string;
	description?: string | null;
	permissionCodes: string[];
}

export interface AuditLog {
	id: number;
	actorId: number | null;
	/** 행위자 이름. 계정이 없거나 시스템 작업이면 null. */
	actorName: string | null;
	action: string;
	entityType: string | null;
	entityId: number | null;
	createdAt: string;
}
