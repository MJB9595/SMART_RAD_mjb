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
		key: "hr",
		label: "인사관리",
		basePath: "/employees",
		sections: [
			{
				label: "인사정보",
				items: [
					{ label: "인사정보등록", href: "/employees" },
					{ label: "인사발령등록", href: "/appointments" },
				],
			},
			{
				label: "경조비관리",
				items: [{ label: "경조비신청", href: "/event-supports" }],
			},
			{
				label: "증명서관리",
				items: [{ label: "증명서발급", href: "/certificate-issues" }],
			},
		],
	},
	{
		key: "attendance",
		label: "근태관리",
		basePath: "/attendance",
		sections: [
			{
				label: "근태관리",
				items: [{ label: "일일근태등록", href: "/attendance" }],
			},
		],
	},
	{
		key: "payroll",
		label: "급여관리",
		basePath: "/payroll",
		sections: [
			{
				label: "급여관리",
				items: [{ label: "급여관리", href: "/payroll" }],
			},
		],
	},
	{
		key: "daily",
		label: "일용직관리",
		basePath: "/daily-workers",
		sections: [
			{
				label: "일용직관리",
				items: [{ label: "일용직관리", href: "/daily-workers" }],
			},
		],
	},
];

export function findActiveTab(pathname: string): TopNavTab {
	const matched = topNavTabs.find((tab) =>
		tab.sections.some((section) => section.items.some((item) => pathname.startsWith(item.href))),
	);
	return matched ?? topNavTabs[0];
}
