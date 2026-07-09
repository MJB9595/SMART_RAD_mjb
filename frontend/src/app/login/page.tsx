"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import { Button, Field, Input } from "@/components/ui";

export default function LoginPage() {
	const { user, loading, login } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!loading && user) {
			router.replace("/employees");
		}
	}, [user, loading, router]);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setSubmitting(true);
		try {
			await login(email, password);
			router.replace("/employees");
		} catch (err) {
			setError(err instanceof ApiError ? err.message : "로그인에 실패했습니다.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="flex flex-1 items-center justify-center p-8">
			<form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 border p-6 rounded">
				<h1 className="text-lg font-semibold">TP-HR 로그인</h1>

				<Field label="이메일">
					<Input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoFocus
					/>
				</Field>

				<Field label="비밀번호">
					<Input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Field>

				{error && <p className="text-sm text-red-600">{error}</p>}

				<Button type="submit" variant="primary" disabled={submitting}>
					{submitting ? "로그인 중..." : "로그인"}
				</Button>
			</form>
		</main>
	);
}
