export interface NavItem {
	label: string;
	href: string;
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
}

export const topNavTabs: TopNavTab[] = [
	{
		key: "records",
		label: "인사기록 관리",
		basePath: "/employees",
		sections: [
			{
				label: "인사기록",
				items: [
					{ label: "인사정보관리", href: "/employees" },
					{ label: "학력·경력 관리", href: "/records/education-career" },
					{ label: "자격증 관리", href: "/records/certifications" },
				],
			},
		],
	},
	{
		key: "appointment",
		label: "인사발령 관리",
		basePath: "/appointments",
		sections: [
			{
				label: "인사발령",
				items: [
					{ label: "발령 등록/승인", href: "/appointments" },
					{ label: "발령 이력 조회", href: "/appointments/history" },
				],
			},
		],
	},
	{
		key: "attendance",
		label: "근태·휴가 관리",
		basePath: "/attendance",
		sections: [
			{
				label: "근태관리",
				items: [{ label: "출퇴근 현황", href: "/attendance" }],
			},
			{
				label: "휴가관리",
				items: [
					{ label: "휴가 신청/승인", href: "/leaves" },
					{ label: "잔여일수 현황", href: "/leave-balance" },
				],
			},
		],
	},
	{
		key: "salary",
		label: "급여 연계 관리",
		basePath: "/salary",
		sections: [
			{
				label: "급여관리",
				items: [
					{ label: "기초 급여 조회", href: "/salary" },
					{ label: "정산용 엑셀 다운로드", href: "/salary/settlement" },
				],
			},
		],
	},
	{
		key: "dashboard",
		label: "통계 대시보드",
		basePath: "/dashboard",
		sections: [
			{
				label: "통계",
				items: [{ label: "현황 대시보드", href: "/dashboard" }],
			},
		],
	},
	{
		key: "system",
		label: "시스템 관리",
		basePath: "/system/roles",
		sections: [
			{
				label: "시스템관리",
				items: [
					{ label: "권한 관리", href: "/system/roles" },
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
