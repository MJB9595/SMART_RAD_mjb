import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { FeedbackProvider } from "@/components/feedback/FeedbackProvider";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// 링크 미리보기(og:image)와 canonical 은 절대 URL 이어야 한다.
// 배포 도메인이 서버마다 다르므로 빌드 인자 NEXT_PUBLIC_SITE_URL 로 주입한다.
// (예: https://tsms.mjb.diskstation.me · https://tsms.o-r.kr)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "TSM";
const SITE_TITLE = "TSM · 학교 인사관리 시스템";
const SITE_DESCRIPTION =
	"근태·급여·인사발령까지, 파편화된 교무 업무를 하나로 통합하는 학교 특화 인사관리 시스템입니다. 복무와 연동된 급여 정산과 권한별 접근 통제를 지원합니다.";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_TITLE,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: [
		"학교 인사관리",
		"교직원 근태관리",
		"교원 복무관리",
		"급여 정산",
		"인사발령",
		"TSM",
	],
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "ko_KR",
		url: "/",
		siteName: SITE_NAME,
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true, "max-image-preview": "large" },
	},
};

export const viewport: Viewport = {
	themeColor: "#ffffff",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="ko"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col">
				<AuthProvider>
					<FeedbackProvider>{children}</FeedbackProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
