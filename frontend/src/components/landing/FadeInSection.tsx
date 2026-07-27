"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface FadeInSectionProps {
	children: ReactNode;
	className?: string;
	direction?: "up" | "left" | "right";
}

export function FadeInSection({ children, className = "", direction = "up" }: FadeInSectionProps) {
	const [isVisible, setIsVisible] = useState(false);
	const domRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					// Toggle visibility based on intersection
					setIsVisible(entry.isIntersecting);
				});
			},
			{
				threshold: 0.1,
				rootMargin: "0px 0px -50px 0px",
			}
		);

		const currentRef = domRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) observer.unobserve(currentRef);
		};
	}, []);

	const getInitialTransform = () => {
		switch (direction) {
			case "left": return "-translate-x-16 translate-y-0";
			case "right": return "translate-x-16 translate-y-0";
			case "up":
			default: return "translate-y-12 translate-x-0";
		}
	};

	return (
		<div
			ref={domRef}
			className={`transition-all duration-1000 ease-out transform ${
				isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${getInitialTransform()}`
			} ${className}`}
		>
			{children}
		</div>
	);
}
