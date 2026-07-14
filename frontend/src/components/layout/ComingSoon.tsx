export function ComingSoon({ title, subtitle }: { title: string; subtitle?: string }) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center text-slate-400">
			<p className="text-lg font-medium text-slate-600">{title}</p>
			<p className="text-sm">{subtitle ?? "준비 중인 화면입니다."}</p>
		</div>
	);
}
