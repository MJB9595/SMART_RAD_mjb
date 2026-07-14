const STYLES: Record<string, string> = {
	APPROVED: "border-blue-400 text-blue-600",
	PENDING: "border-slate-300 text-slate-500",
	REJECTED: "border-red-300 text-red-500",
	EMPLOYED: "border-blue-400 text-blue-600",
	ON_LEAVE: "border-amber-300 text-amber-600",
	RESIGNED: "border-slate-300 text-slate-500",
	ISSUED: "border-blue-400 text-blue-600",
	PRESENT: "border-blue-400 text-blue-600",
	LATE: "border-amber-300 text-amber-600",
	ABSENT: "border-red-300 text-red-500",
	ANNUAL_LEAVE: "border-slate-300 text-slate-500",
};

const LABELS: Record<string, string> = {
	APPROVED: "승인",
	PENDING: "대기",
	REJECTED: "반려",
	EMPLOYED: "재직",
	ON_LEAVE: "휴직",
	RESIGNED: "퇴직",
	ISSUED: "발급완료",
	PRESENT: "출근",
	LATE: "지각",
	ABSENT: "결근",
	ANNUAL_LEAVE: "연차",
};

export function StatusBadge({ status }: { status: string }) {
	return (
		<span
			className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${
				STYLES[status] ?? "border-slate-300 text-slate-500"
			}`}
		>
			{LABELS[status] ?? status}
		</span>
	);
}
