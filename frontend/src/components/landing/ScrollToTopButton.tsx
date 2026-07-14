"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			onClick={scrollToTop}
			className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
				isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
			}`}
			aria-label="Scroll to top"
		>
			<ArrowUp className="h-5 w-5" strokeWidth={2.5} />
		</button>
	);
}
