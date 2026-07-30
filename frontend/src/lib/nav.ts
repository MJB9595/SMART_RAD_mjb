export interface NavItem {
	label: string;
	href: string;
	/** 이 권한을 가진 사용자에게만 보인다. 권한 관리에서 역할에 권한을 주면 곧바로 나타난다. */
	requiredPermission?: string;
}

export interface NavSection {
	label: string;
	items: NavItem[];
}

export interface TopNavTab {
	key: string;
	label: string;
	basePath: string;
	sections: NavSection[];
	/** 이 권한을 가진 사용자에게만 보인다. */
	requiredPermission?: string;
}

export const topNavTabs: TopNavTab[] = [
	{
		key: "records",
		label: "인사기록 관리",
		basePath: "/employees",
		sections: [
			{
				label: "인사기록 관리",
				items: [
					{ label: "교직원 정보관리", href: "/employees" },
					{ label: "교직원 통계 대시보드", href: "/dashboard/headcount" },
				],
			},
		],
	},
	{
		key: "appointment",
		label: "인사발령 관리",
		basePath: "/appointments",
		requiredPermission: "APPOINTMENT_APPROVE",
		sections: [
			{
				label: "인사발령 관리",
				items: [
					{ label: "발령 등록/승인", href: "/appointments" },
					{ label: "발령 이력 조회", href: "/appointments/history" },
				],
			},
		],
	},
	{
		key: "attendance-leaves",
		label: "근태·휴가 관리",
		basePath: "/attendance",
		sections: [
			{
				label: "근태·휴가 관리",
				items: [
					{ label: "일일 근태 관리", href: "/attendance" },
					{ label: "월 근태 관리 · 현황", href: "/attendance/monthly" },
					{ label: "월 휴가 관리 · 현황", href: "/leaves" },
				],
			},
		],
	},
	{
		key: "salary",
		label: "급여 관리",
		basePath: "/payroll",
		sections: [
			{
				label: "급여 관리",
				items: [
					{ label: "급여 명세서 조회", href: "/payroll" },
					{ label: "수당 관리", href: "/payroll/allowance", requiredPermission: "PAYROLL_READ" },
					{ label: "정산 엑셀 다운로드", href: "/payroll/settlement", requiredPermission: "PAYROLL_READ" },
				],
			},
		],
	},
	{
		key: "welfare",
		label: "복지·증명 관리",
		basePath: "/welfare/event-support",
		sections: [
			{
				label: "복지·증명 관리",
				items: [
					{ label: "경조비 신청/승인", href: "/welfare/event-support" },
					{ label: "증명서 발급", href: "/welfare/certificate" },
				],
			},
		],
	},
	{
		key: "system",
		label: "시스템 관리",
		basePath: "/system/roles",
		requiredPermission: "SYSTEM_MANAGE",
		sections: [
			{
				label: "시스템 관리",
				items: [
					{ label: "권한 관리 (RBAC)", href: "/system/roles" },
					{ label: "공통 코드 관리", href: "/system/codes" },
					{ label: "감사로그 조회", href: "/system/audit" },
				],
			},
		],
	},
];

/** 현재 경로에 매칭되는 최장 href를 가진 탭을 활성으로 본다. */
export function findActiveTab(pathname: string): TopNavTab {
	let best: TopNavTab | null = null;
	let bestLen = -1;
	for (const tab of topNavTabs) {
		for (const section of tab.sections) {
			for (const item of section.items) {
				if ((pathname === item.href || pathname.startsWith(item.href + "/")) && item.href.length > bestLen) {
					best = tab;
					bestLen = item.href.length;
				}
			}
		}
	}
	return best ?? topNavTabs[0];
}

/** 사이드바 항목 활성 여부 — 섹션 내에서 최장 매칭만 활성. */
export function isNavItemActive(pathname: string, href: string, allHrefs: string[]): boolean {
	const matches = (h: string) => pathname === h || pathname.startsWith(h + "/");
	if (!matches(href)) return false;
	const longest = allHrefs.filter(matches).reduce((a, b) => (b.length > a.length ? b : a), "");
	return href === longest;
}
