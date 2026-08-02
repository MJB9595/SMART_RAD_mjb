import type { MetadataRoute } from "next";

// 랜딩페이지만 색인 대상이고, 로그인 이후의 업무 화면은 크롤링에서 제외한다.
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/login",
				"/signup",
				"/oauth/",
				"/dashboard",
				"/employees",
				"/attendance",
				"/leaves",
				"/leave-balance",
				"/appointments",
				"/payroll",
				"/welfare",
				"/system",
			],
		},
	};
}
