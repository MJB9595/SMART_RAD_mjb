import { clearToken, getToken } from "@/lib/auth/token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export class ApiError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
	const token = getToken();
	const { body, headers, ...rest } = options;

	const res = await fetch(`${API_BASE_URL}${path}`, {
		...rest,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...headers,
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	if (res.status === 401) {
		clearToken();
		window.dispatchEvent(new Event("tp-hr:unauthorized"));
	}

	if (!res.ok) {
		const message = await res
			.json()
			.then((data) => data.message as string)
			.catch(() => `요청 처리 중 오류가 발생했습니다. (${res.status})`);
		throw new ApiError(res.status, message);
	}

	if (res.status === 204) {
		return undefined as T;
	}

	return res.json() as Promise<T>;
}
