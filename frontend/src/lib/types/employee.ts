export type EmployeeRole = "ADMIN" | "EMPLOYEE";
export type EmploymentStatus = "EMPLOYED" | "ON_LEAVE" | "RESIGNED";
export type StaffCategory = "FACULTY" | "STAFF";

export interface Employee {
	id: number;
	employeeNumber: string;
	name: string;
	email: string;
	phone: string | null;
	staffCategory: StaffCategory;
	departmentId: number;
	departmentName: string;
	positionId: number;
	positionName: string;
	employmentTypeId: number;
	employmentTypeName: string;
	role: EmployeeRole;
	employmentStatus: EmploymentStatus;
	hireDate: string;
	resignDate: string | null;
	birthDate: string | null;
	gender: string | null;
	address: string | null;
	emergencyContact: string | null;
	version: number;
}

export interface Page<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

// 인사기록카드 하위 리소스
export interface Education {
	id: number;
	employeeId: number;
	schoolName: string;
	major: string | null;
	degree: string | null;
	admissionDate: string | null;
	graduationDate: string | null;
	status: string | null;
}

export interface Career {
	id: number;
	employeeId: number;
	companyName: string;
	department: string | null;
	position: string | null;
	jobDescription: string | null;
	startDate: string;
	endDate: string | null;
}

export interface Certification {
	id: number;
	employeeId: number;
	name: string;
	issuer: string | null;
	certNumber: string | null;
	acquiredDate: string | null;
	expiryDate: string | null;
}

export interface Family {
	id: number;
	employeeId: number;
	familyName: string;
	familyRelation: string;
	birthDate: string | null;
	job: string | null;
	livingTogether: boolean | null;
	dependent: boolean | null;
	disabled: boolean | null;
}

export interface Military {
	id: number;
	employeeId: number;
	militaryType: string | null;
	militaryRank: string | null;
	dischargeType: string | null;
	enlistmentDate: string | null;
	dischargeDate: string | null;
	exemptionReason: string | null;
}

export interface Language {
	id: number;
	employeeId: number;
	languageName: string;
	readingLevel: string | null;
	writingLevel: string | null;
	speakingLevel: string | null;
	testName: string | null;
	testScore: string | null;
	issuedDate: string | null;
	issuer: string | null;
}

export interface EmployeeRecordSummary {
	employeeId: number;
	latestEducation: string | null;
	topCertification: string | null;
	educationCount: number;
	careerCount: number;
	certificationCount: number;
	yearsOfService: number | null;
	expiringCertificationCount: number;
}
