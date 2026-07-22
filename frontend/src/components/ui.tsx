import type {
	InputHTMLAttributes,
	LabelHTMLAttributes,
	ButtonHTMLAttributes,
	SelectHTMLAttributes,
} from "react";

const BUTTON_VARIANTS = {
	primary: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
	outline: "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
};

export function Button(
	props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof BUTTON_VARIANTS },
) {
	const { className, variant = "outline", ...rest } = props;
	return (
		<button
			className={`rounded border px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${BUTTON_VARIANTS[variant]} ${className ?? ""}`}
			{...rest}
		/>
	);
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
	const { className, ...rest } = props;
	return (
		<input
			className={`rounded border border-slate-300 px-2 py-1.5 text-sm text-slate-900 dark:text-slate-900 bg-white focus:border-blue-500 focus:outline-none ${className ?? ""}`}
			{...rest}
		/>
	);
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
	const { className, ...rest } = props;
	return (
		<select
			className={`rounded border border-slate-300 px-2 py-1.5 text-sm text-slate-900 dark:text-slate-900 bg-white focus:border-blue-500 focus:outline-none ${className ?? ""}`}
			{...rest}
		/>
	);
}

export function Field(props: LabelHTMLAttributes<HTMLLabelElement> & { label: string }) {
	const { label, children, ...rest } = props;
	return (
		<label className="flex flex-col gap-1 text-sm text-slate-900 dark:text-slate-900" {...rest}>
			<span>{label}</span>
			{children}
		</label>
	);
}
