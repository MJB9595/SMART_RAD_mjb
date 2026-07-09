export function LandingSection({ label }: { label: string }) {
	return (
		<section className="flex min-h-[400px] items-center justify-center border-b text-2xl font-semibold text-slate-400">
			{label}
		</section>
	);
}
