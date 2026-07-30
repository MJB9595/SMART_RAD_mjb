"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

/**
 * 화면 안에서 처리하는 알림·확인 창.
 *
 * <p>브라우저 기본 alert()/confirm() 은 앱 스타일과 따로 놀고, 문구를 길게 쓸 수 없으며,
 * 자동화 환경에서는 아예 차단된다. 여기로 모아 토스트와 모달로 처리한다.
 */

type Tone = "error" | "success" | "info";

interface ConfirmOptions {
	title: string;
	message?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	/** 되돌리기 어려운 조작이면 true — 확인 버튼이 빨갛게 표시된다. */
	danger?: boolean;
}

interface FeedbackValue {
	notify: (message: string, tone?: Tone) => void;
	confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackValue | null>(null);

interface Toast {
	id: number;
	message: string;
	tone: Tone;
}

const TONE_STYLE: Record<Tone, string> = {
	error: "border-rose-200 bg-rose-50 text-rose-800",
	success: "border-emerald-200 bg-emerald-50 text-emerald-800",
	info: "border-slate-200 bg-white text-slate-700",
};

const TONE_ICON: Record<Tone, string> = { error: "!", success: "✓", info: "i" };

const TONE_BADGE: Record<Tone, string> = {
	error: "bg-rose-500",
	success: "bg-emerald-500",
	info: "bg-slate-400",
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [pending, setPending] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);
	const seq = useRef(0);

	const notify = useCallback((message: string, tone: Tone = "error") => {
		const id = ++seq.current;
		setToasts((prev) => [...prev, { id, message, tone }]);
		// 오류는 읽을 시간을 조금 더 준다
		const ttl = tone === "error" ? 6000 : 3500;
		setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), ttl);
	}, []);

	const confirm = useCallback(
		(options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ ...options, resolve })),
		[],
	);

	function settle(ok: boolean) {
		pending?.resolve(ok);
		setPending(null);
	}

	return (
		<FeedbackContext.Provider value={{ notify, confirm }}>
			{children}

			{/* 토스트 */}
			<div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
				{toasts.map((t) => (
					<div
						key={t.id}
						role="status"
						className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg max-w-[380px] ${TONE_STYLE[t.tone]}`}
					>
						<span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${TONE_BADGE[t.tone]}`}>
							{TONE_ICON[t.tone]}
						</span>
						<span className="flex-1 text-[13px] font-semibold whitespace-pre-line">{t.message}</span>
						<button
							type="button"
							onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
							className="shrink-0 opacity-50 hover:opacity-100 leading-none text-[15px]"
							aria-label="닫기"
						>
							&times;
						</button>
					</div>
				))}
			</div>

			{/* 확인 창 */}
			{pending && (
				<div className="modal-overlay">
					<div className="modal" style={{ maxWidth: "420px" }}>
						<div className="modal-head">
							<div className="modal-title">{pending.title}</div>
							<button type="button" onClick={() => settle(false)} className="modal-x">&times;</button>
						</div>
						<div className="modal-body">
							{pending.message && (
								<div className="text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-line">{pending.message}</div>
							)}
							<div className="modal-foot" style={{ marginTop: "20px" }}>
								<button type="button" onClick={() => settle(false)} className="btn-ghost">
									{pending.cancelLabel ?? "취소"}
								</button>
								<button
									type="button"
									onClick={() => settle(true)}
									className="btn-primary"
									style={pending.danger ? { background: "#DC2626" } : undefined}
								>
									{pending.confirmLabel ?? "확인"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</FeedbackContext.Provider>
	);
}

export function useFeedback(): FeedbackValue {
	const ctx = useContext(FeedbackContext);
	if (!ctx) {
		throw new Error("useFeedback은 FeedbackProvider 내부에서만 사용할 수 있습니다.");
	}
	return ctx;
}
