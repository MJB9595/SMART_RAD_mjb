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

	// 201 등 본문이 비어 있는 성공 응답도 허용 (빈 본문에 JSON.parse 하지 않음)
	const text = await res.text();
	return (text ? (JSON.parse(text) as T) : (undefined as T));
}

/** Content-Disposition에서 파일명 추출. RFC 5987 `filename*`을 우선 사용한다. */
function parseFileName(disposition: string | null, fallback: string): string {
	if (!disposition) return fallback;

	const encoded = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
	if (encoded) {
		try {
			return decodeURIComponent(encoded[1].trim());
		} catch {
			// 인코딩이 깨진 경우 아래 plain filename으로 넘어간다.
		}
	}

	const plain = /filename="?([^";]+)"?/i.exec(disposition);
	return plain ? plain[1].trim() : fallback;
}

/**
 * 엑셀 등 첨부파일 응답을 받아 브라우저 다운로드를 실행한다.
 * 인증/401 처리와 오류 메시지 규약은 apiFetch와 동일하게 유지한다.
 */
export async function apiDownload(path: string, fallbackFileName: string): Promise<void> {
	const token = getToken();

	const res = await fetch(`${API_BASE_URL}${path}`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});

	if (res.status === 401) {
		clearToken();
		window.dispatchEvent(new Event("tp-hr:unauthorized"));
	}

	if (!res.ok) {
		const message = await res
			.text()
			.then((text) => (text ? (JSON.parse(text).message as string) : ""))
			.catch(() => "")
			.then((parsed) => parsed || `파일을 내려받지 못했습니다. (${res.status})`);
		throw new ApiError(res.status, message);
	}

	const blob = await res.blob();
	const fileName = parseFileName(res.headers.get("Content-Disposition"), fallbackFileName);
	const url = window.URL.createObjectURL(blob);

	try {
		const link = document.createElement("a");
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		link.remove();
	} finally {
		window.URL.revokeObjectURL(url);
	}
}
